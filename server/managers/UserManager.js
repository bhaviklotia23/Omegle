import { RoomManager } from "./RoomManager.js";

export class UserManager {
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }
  addUser(name, socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    this.clearQueue();
    this.initHandlers();
  }

  removeUser(socketId) {
    this.users = this.users.filter((x) => x.socket.id === socketId);
  }

  clearQueue() {
    if (this.queue.length < 2) {
      return;
    }
    const user1 = this.users.find((x) => x.socket.id === this.queue.pop());
    const user2 = this.users.find((x) => x.socket.id === this.queue.pop());

    if (!user1 || !user2) {
      return;
    }
    const room = this.roomManager.createRoom(user1, user2);
  }

  initHandlers(socket) {
    socket.on("offer", ({ sdp, roomId }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ sdp, roomId }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}
