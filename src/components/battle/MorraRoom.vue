<template>
  <div id="battle-contaioner">
    <!-- 左边是我 -->
    <div class="left">
      <div v-if="myUserInfo" class="users">
        <img :src="myUserInfo.avatar" alt />
        <div class="userinfo">
          <span>{{myUserInfo.username}}</span>
        </div>
      </div>
      <el-button v-if="isready" type="danger" @click="onready()" :disabled="isstart">取消</el-button>
      <el-button v-else type="success" @click="onready()">准备</el-button>
    </div>
    <!-- 中间 canvas -->
    <canvas id="mycanvas" width="800" height="600"></canvas>
    <!-- 右边对手 -->
    <div class="right">
      <div v-if="rightUserInfo" class="users">
        <img :src="rightUserInfo.avatar" alt />
        <div class="userinfo">
          <span>{{rightUserInfo.username}}</span>
        </div>
      </div>
      <span>{{rightReady}}</span>
    </div>
  </div>
</template>

<script>
import SceneManager from "../../js/morra/SceneManager";

export default {
  data() {
    return {
      myUserInfo: {}, // 左边边玩家，我自己
      rightUserInfo: {}, // 右边，对手
      isready: false, // 是否准备
      rightReady: "未准备", // 右边是否准备
      isstart: false // 是否开始
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.setCanvas();
  },
  beforeDestroy() {
    this.leaveRoom(); // 退出时离开房间
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.leaveRoom);
  },
  methods: {
    // 获取自己的信息
    getUserInfo() {
      this.myUserInfo = this.$store.getters.getUserInfo;
    },
    // 设置 canvas
    setCanvas() {
      this.canvas = document.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.sceneManager = new SceneManager(this.canvas, this.ctx, this.$socket);
      this.sceneManager.enter();
    },
    // 初始化玩家信息
    setPlayers(playerlist) {
      playerlist.map(item => {
        if (item.userid === this.myUserInfo.userid) {
          this.myUserInfo = item;
        } else {
          this.rightUserInfo = item;
        }
      });
    },
    // 准备按钮
    onready() {
      if(!this.rightUserInfo.userid){
        return;
      }
      this.sceneManager.init();
      this.$socket.emit("onready");
    },
    // 重置
    reset() {
      this.isready = false;
      this.rightReady = "未准备";
      this.isstart = false;
    },
    // 离开房间
    leaveRoom() {
      this.$socket.emit("leave", this.userinfo);
    },
  },
  sockets: {
    // 玩家加入游戏
    playerjoin(playerlist) {
      //  设置对手
      window.console.log(playerlist);
      this.setPlayers(playerlist);
      //   this.sceneManager.setPlayers();
    },
    // 对手离开房间
    exit(){
      this.reset();
      this.rightUserInfo = {};
      this.sceneManager.init();
      this.sceneManager.render();
    },
    // 准备
    ready(readyID) {
      window.console.log(readyID);
      if (readyID === this.myUserInfo.userid) {
        this.isready = !this.isready;
      } else if (readyID === this.rightUserInfo.userid) {
        this.rightReady = this.rightReady === "准备" ? "未准备" : "准备";
      }
    },
    // 开始游戏
    start() {
      window.console.log("start");
      this.isstart = true;
      this.sceneManager.sceneNumber = 2;
      this.sceneManager.enter();
    },
    // 玩家选择
    choose(req) {
      if (this.myUserInfo.userid === req) {
        this.sceneManager.update("my");
      } else if (this.rightUserInfo.userid === req) {
        this.sceneManager.update("oth");
      } else {
        return this.$message.error("连接出错!!!");
      }
    },
    // 结束
    end(req) {
      this.sceneManager.sceneNumber = 3;
      req.data.map(item => {
        if (item.userid === this.rightUserInfo.userid) {
          if (item.userid === req.result) {
            this.sceneManager.enter({ name: item.choose, res: "失败" });
          }else if(req.result===0){
            this.sceneManager.enter({ name: item.choose, res: "平局" });
          }else{
            this.sceneManager.enter({ name: item.choose, res: "胜利" });
          }
        }
      });
      this.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
#battle-contaioner {
  background: linear-gradient(to bottom, #616c8a 0%,#657090 23%,#6C799B 50%,#737fa5 70%,#7783a9 100%);
  display: flex;
  .left,
  .right {
    width: 50px;
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    .users {
      margin-top: 100px;
      .userinfo {
        margin-top: 8px;
        display: flex;
        justify-content: center;
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
  img {
    width: 120px;
    height: 120px;
  }
}
canvas {
  background-color: #ccc;
  margin: 0 auto;
}
</style>