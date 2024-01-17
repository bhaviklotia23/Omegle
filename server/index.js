import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

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

const secretKey = "fgdhfdsvhjv";

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

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});