import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", function (req, res) {
  var ua = req.header("user-agent");
  // Check the user-agent string to identyfy the device.
  if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(
      ua
    )
  ) {
    res.sendFile(join(__dirname + "/public/mobile.html"));
  } else {
    res.sendFile(join(__dirname + "/public/index.html"));
  }
});
app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.on("connection", (socket) => {
  socket.on("change", (color, icon) => {
    console.log(color, icon);
    io.emit("change-color", color);
    io.emit("change-icon", icon);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
