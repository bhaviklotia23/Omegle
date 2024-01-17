import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { UserManager } from "./managers/UserManager.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const port = 5000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) {
//       return next(err);
//     }

//     const token = socket.request.cookies.token;

//     if (!token) {
//       return next(new Error("Auth Error"));
//     }

//     const decoded = jwt.verify(token, secretKey);

//     next();
//   });
// });

const userManager = new UserManager();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  userManager.addUser("RandomUser", socket);

  socket.on("disconnect", () => {
    userManager.removeUser(socket.id);
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
