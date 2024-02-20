import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* -------------------------------------------------------------------------- */
/*                                  Socket IO                                 */
/* -------------------------------------------------------------------------- */
import { Server } from "socket.io";
// import { createServer } from "http";

import * as http from 'http';

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */
// import User from "./models/UserModel.js";
// import Web from "./models/WebModel.js";
// import Mobile from "./models/MobileModel.js";

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import webRoutes from "./routes/webs.js";
import mobileRoutes from "./routes/mobiles.js";
import followsRoutes from "./routes/followsRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

/* -------------------------------------------------------------------------- */
/*                                    Post                                    */
/* -------------------------------------------------------------------------- */
import authPost from './post/authPost.js';
import webPost from './post/webPost.js';
import mobilePost from './post/mobilePost.js';

/* -------------------------------------------------------------------------- */
/*                                 Middlewere                                 */
/* -------------------------------------------------------------------------- */
import { verifyToken } from "./middleware/auth.js";

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */
// import { 
//   users, 
//   webs, 
//   mobiles 
// } from "./data/index.js";

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATIONS                               */
/* -------------------------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/* -------------------------------------------------------------------------- */
/*                                   Express                                  */
/* -------------------------------------------------------------------------- */
const app = express();

// * JSON
app.use(express.json());

// * To Handle Request safety
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// * Login API
app.use(morgan("common"));

// * API Request
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// * Cross Origin Resource Sharing
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                                 Images Path                                */
/* -------------------------------------------------------------------------- */
app.use("/profile", express.static(path.join(__dirname, "public/profile")));
app.use("/websites", express.static(path.join(__dirname, "public/websites")));
app.use("/mobiles", express.static(path.join(__dirname, "public/mobiles")));

/* -------------------------------------------------------------------------- */
/*                             ROUTES Insert Data                             */
/* -------------------------------------------------------------------------- */
authPost(app);
webPost(app, verifyToken);
mobilePost(app, verifyToken);

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/follows", followsRoutes);
app.use("/webs", webRoutes);
app.use("/mobiles", mobileRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

/* -------------------------------------------------------------------------- */
/*                                  Socket IO                                 */
/* -------------------------------------------------------------------------- */
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: { 
    origin: "http://localhost:3000",
    // origin: '*' // Allowed All Domain
    // credentials: true,
  } 
});

/* -------------------------------------------------------------------------- */
/*                               MONGOOSE SETUP                               */
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/*                              Mongooose Connect                             */
/* -------------------------------------------------------------------------- */
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {

    /* ---------------------------- ADD DATA ONE TIME --------------------------- */
    // User.insertMany(users);
    // Web.insertMany(webs);
    // Mobile.insertMany(mobiles);

    /* -------------------------- Socket.io connection -------------------------- */
    io.on('connection', (socket) => {

      /* -------------------------- Connection on Server -------------------------- */
      // console.log('A user connected');
      // console.log(socket.id);

      /* ------------------------------ Setup of User ----------------------------- */
      socket.on("setup", (userData) => {
        socket.join(userData);
        socket.emit("connected");
        // console.log(userData);
      });

      /* ----------------------------- Turn Off Socket ---------------------------- */
      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData);
      });

      /* --------------------------------- Follow --------------------------------- */
      socket.on("follow", (action, user, room) => {

        // * Log
        // console.log('User : ' + user);
        // console.log('Action : ' + action);

        // * send to all listeners including the sender
        // io.emit('follow-recieved', user );

        // * send message only to sender-client (Callback)
        // socket.emit('follow-recieved', 'Callback');

        // * Send to all listeners except the sender
        // socket.broadcast.emit("follow-recieved", user);

        // * send it to a room (Specific Person)
        socket.broadcast.to(room).emit(
          'follow-recieved',
           action,
           user
        );

      });

      /* ----------------------------- Confirm Follow ----------------------------- */
      socket.on("confirm-follow", (id, yourData, room) => {

        // * send it to a room (Specific Person)
        socket.broadcast.to(room).emit(
          'confirm-follow-recieved', 
          id, 
          yourData
        );

      });

      /* ------------------------------ Remove Follow ----------------------------- */
      socket.on("remove-follow", (user, room) => {

        // * send it to a room (Specific Person)
        socket.broadcast.to(room).emit('remove-follow-recieved', user);

      });

      /* ---------------------------- Set Active Status --------------------------- */
      socket.on("active-status", (action, user) => {

        // * Broadcast that you are online
        socket.broadcast.emit(
          'active-status-recieved',
           action,
           user
        );

      });

      /* ------------------------------ Join the Chat ----------------------------- */
      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      /* --------------------------------- Typing --------------------------------- */
      socket.on("typing", (room, id, type, picturePath) => {        
        socket.in(room).emit(
          "typing",
          id,
          type,
          picturePath
        );

        console.log("Typing " + room);
      });

      /* ------------------------------- Stop Typing ------------------------------ */
      socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");

        console.log("Stop Typing " + room);
      });

      /* ------------------------------- New Message ------------------------------ */
      socket.on("new message", (newMessageRecieved) => {

        var chat = newMessageRecieved.chat;

        // console.log(chat);
        // console.log(newMessageRecieved);

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {

          // Don't send back your own message
          if (user._id == newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message recieved", newMessageRecieved);

        });

      });
      
      /* ----------------------------- Message Delete ----------------------------- */
      socket.on("message-delete", (room, messageId) => {

        // * send it to a room (Specific Person)
        socket.broadcast.to(room).emit(
          'message-delete-recieved', 
          messageId
        );

      });

      /* -------------------- Multiple Arguments with Callback -------------------- */
      // socket.on("follow", (arg1, arg2, callback) => {
      //   console.log(arg1);
      //   console.log(arg2);
      //   callback({
      //     status: "ok"
      //   });
      // });

      /* ----------------------------- Test Dependency ---------------------------- */
      // getApiAndEmit(socket);
      //   socket.on('api', () => {
      //   console.log('API Emit');
      // });

    });

    /* --------------------- Test: Transmit Data to Frontend -------------------- */
    // const getApiAndEmit = (socket) => {
    //   const response = 'response you need';
    //   socket.emit('FromAPI', response);
    // };

    /* -------------------- Start the server using socket.io -------------------- */
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    /* ---------- Start the server using APP Express.js (Don't Delete) ---------- */
    // app.listen(PORT, () => { 
    //  console.log(`Server Port: ${PORT}`) 
    // });

  }
).catch((error) => console.log(`${error} did not connect`));
