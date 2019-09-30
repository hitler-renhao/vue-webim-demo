<template>
  <div>
    <div>
      <h3>登陆</h3>登陆账号:
      <input type="text" name="name" id="name">
      <br>登陆密码:
      <input type="text" name="pwd" id="pwd">
      <br>接收账号:
      <input type="text" name="toname" id="toname">
      <br>消息内容:
      <input type="text" name="msg" id="msg">
      <br>
      <br>
      <br>
      <button type="button" @click="loginWeb()">登陆</button>
      <button type="button" @click="logout()">退出</button>
    </div>
    <br>
    <div>
      <h3>单聊</h3>
      <button type="button" @click="sendTextMsg()">发送文本</button>
      <button type="button" @click="sendCmdMsg()">发送透传</button>
      <br>image:
      <input type="file" id="dimg">
      <button type="button" @click="sendImgMsg()">发送图片</button>
    </div>
    <div>
      <h3>群聊</h3>
      <button type="button" @click="createGroup()">创建群组</button>
      <button type="button" @click="addGroupMember()">邀请用户进群</button>
      <button type="button" @click="listGroupMember()">获取群组列表</button>
      <button type="submit" @click="sendGroupTxt()">群组文本消息</button>
      <br>image:
      <input type="file" id="gimg">
      <button type="button" @click="sendGroupImg()">群组发送图片</button>
      <br>video:
      <input type="file" id="gvideo">
      <button type="button" @click="sendGroupVideo()">群组发送音频</button>
    </div>
    <div>
      <h3>单人音视频</h3>
      <button type="button" @click="rtVideoCall()">视频通话</button>
      <button type="button" @click="rtAudioCall()">音频通话</button>
      <!-- <button type="button" @click="rtAcceptCall()">AcceptCall</button> -->
      <button type="button" @click="rtEndCall()">结束通话</button>
    </div>
    <div>
      <h3>多人音视频会议</h3>会议ID：
      <input type="text" id="conferId">
      <br>会议密码：
      <input type="text" id="conferPwd">
      <br>
      <button type="button" @click="createConfr()">创建会议</button>
      <button type="button" @click="pushVideo()">发布视频流</button>
      <button type="button" @click="inviteUser()">CMD邀请</button>
      <button type="button" @click="inviteUserText()">文本邀请</button>
      <button type="button" @click="newinvite()">新邀请</button>
      <button type="button" @click="removeUser()">移除会议成员</button>
      <button type="button" @click="desktopWith()">桌面共享</button>
      <button type="button" @click="endConVideo()">退出会议</button>
      <br>
      <h3>rest 创建会议</h3>
      <button type="button" @click="csJoinConfer()">测试加入视频会议</button>
    </div>
    <div id="log"></div>
    <div>
      <br>
      <video id="v1" autoplay></video>
      <video id="v2" muted="true" autoplay></video>
      <video id="v3" autoplay></video>
    </div>
  </div>
</template>

<script>
import { conn, rtcCall, memberNames } from "../router/initWeb";
let result;
let resultCon;
WebIM.message = WebIM.default.message;
WebIM.utils = WebIM.default.utils;
WebIM.debug = WebIM.default.debug;
WebIM.statusCode = WebIM.default.statusCode;
export default {
  name: "Hello",
  methods: {
    loginWeb() {
      var uname = document.getElementById("name").value;
      var upwd = document.getElementById("pwd").value;
      var options = {
        apiUrl: WebIM.config.apiURL,
        user: uname,
        pwd: upwd,
        appKey: WebIM.config.appkey
      };
      conn.open(options);
    },
    logout() {
      conn.close();
    },
    sendTextMsg() {
      var toname = document.getElementById("toname").value;
      var tomsg = document.getElementById("msg").value;
      var id = conn.getUniqueId();
      var msg = new WebIM.message("txt", id);
      msg.set({
        msg: tomsg, // 消息内容
        to: toname, // 接收消息对象（用户id）
        roomType: false,
        ext:{
          "msg":"测试消息"
        },
        success: function(id, serverMsgId) {
          console.log("send private text Success");
          console.log(id, serverMsgId);
        },
        fail: function(e) {
          console.log("Send private text error");
        }
      });
      conn.send(msg.body);
      console.log(msg.body);
    },
    sendCmdMsg() {
      var toname = document.getElementById("toname").value;
      var id = conn.getUniqueId(); //生成本地消息id
      var msg = new WebIM.message("cmd", id); //创建命令消息
      msg.set({
        msg: "msg",
        to: toname, //接收消息对象
        action: "ACTIONMONITOR", //用户自定义，cmd消息必填  //用户自扩展的消息内容（群聊用法相同）
        ext:{
          "cmd":"测试cmd 消息"
        },
        success: function(id, serverMsgId) {
          console.log("发送cmd 成功");
        } //消息发送成功回调
      });

      conn.send(msg.body);
    },
    sendImgMsg() {
      var tname = document.getElementById("toname").value;
      var id = conn.getUniqueId(); // 生成本地消息id
      var msg = new WebIM.message("img", id); // 创建图片消息
      var input = document.getElementById("dimg"); // 选择图片的input
      var file = WebIM.utils.getFileUrl(input); // 将图片转化为二进制文件
      var allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true
      };
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: tname, // 接收消息对象
          roomType: false,
          chatType: "singleChat",
          ext:{
            "img":"测试img 消息"
          },
          onFileUploadError: function() {
            // 消息上传失败
            console.log("onFileUploadError");
          },
          onFileUploadComplete: function(message) {
            // 消息上传成功
            console.log(
              "上传成功：/n " +
                JSON.stringify(message.uri + "/" + message.entities[0].uuid)
            );
          },
          success: function() {
            // 消息发送成功
            console.log("Success");
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
        console.log(msg.body);
      }
    },
    createGroup() {
      var options = {
        data: {
          groupname: "testGroup111",
          desc: "这是测试创建群组",
          // members: ["1v1v", "1z1z"],
          public: true,
          approval: true,
          allowinvites: false
        },
        success: function(respData) {
          console.log("创建群组成功:" + respData);
          result = respData;
        },
        error: function() {
          console.log("创建群组失败");
        }
      };
      conn.createGroupNew(options);
    },
    addGroupMember() {
      var option = {
        users: ["1m1m"],
        groupId: result.data.groupid
      };
      conn.inviteToGroup(option);
    },
    listGroupMember() {
      var pageNum = 1,
        pageSize = 1000;
      var options = {
        pageNum: pageNum, // 页码
        pageSize: pageSize, // 预期每页获取的记录数
        groupId: result.data.groupid,
        success: function(resp) {
          console.log("Response: ", resp);
        },
        error: function(e) {}
      };
      conn.listGroupMember(options);
    },
    sendGroupTxt(){
      var id = conn.getUniqueId();            // 生成本地消息id
            var msg = new WebIM.message('txt', id); // 创建文本消息
            var option = {
                msg: '测试群组消息',             // 消息内容
                to: result.data.groupid,//"86944192200705",                     // 接收消息对象(群组id)
                roomType: false,
                chatType: 'chatRoom',
                success: function (message) {
                    console.log('send room text success',message);
                },
                fail: function (error) {
                    console.log('failed',error);
                }
            };
            msg.set(option);
            msg.setGroup('groupchat');
            conn.send(msg.body);
    },
    sendGroupImg() {
      var id = conn.getUniqueId(); // 生成本地消息id
      var msg = new WebIM.message("img", id); // 创建图片消息
      var input = document.getElementById("gimg"); // 选择图片的input
      var file = WebIM.utils.getFileUrl(input); // 将图片转化为二进制文件
      var allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true
      };
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: "80802615459841", // 接收消息对象
          roomType: false,
          chatType: "chatroom",
          onFileUploadError: function(message) {
            // 消息上传失败
            console.log("onFileUploadError");
            console.log("上传失败：" + JSON.stringify(message));
          },
          onFileUploadComplete: function(message) {
            // 消息上传成功
            console.log("onFileUploadComplete");
            console.log("上传成功：" + JSON.stringify(message));
          },
          success: function() {
            // 消息发送成功
            console.log("发送群组图片消息成功");
          },
          fail: function() {
            console.log("发送失败");
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        msg.setGroup("groupchat");
        conn.send(msg.body);
        console.log(msg);
      }
    },
    sendGroupVideo() {
      var id = conn.getUniqueId(); // 生成本地消息id
      var msg = new WebIM.message("video", id); // 创建视频消息
      var input = document.getElementById("gvideo"); // 选择视频的input
      var file = WebIM.utils.getFileUrl(input); // 将视频转化为二进制文件
      var allowType = {
        mp4: true,
        wmv: true,
        avi: true,
        rmvb: true,
        mkv: true
      };
      if (file.filetype.toLowerCase() in allowType) {
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: "80802615459841", // 接收消息对象
          ext: {
            time: "2019-5-22 18:02"
          },
          roomType: false,
          chatType: "chatroom",
          onFileUploadError: function() {
            // 消息上传失败
            console.log("onFileUploadError");
          },
          onFileUploadComplete: function() {
            // 消息上传成功
            console.log("onFileUploadComplete");
          },
          success: function() {
            // 消息发送成功
            console.log("Success");
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        msg.setGroup("groupchat");
        conn.send(msg.body);
        console.log(msg.body);
      }
    },
    rtVideoCall() {
      var uname = document.getElementById("name").value;
      var tname = document.getElementById("toname").value;
      rtcCall.caller = uname;
      rtcCall.makeVideoCall(tname);
    },
    rtAudioCall() {
      var tname = document.getElementById("toname").value;
      console.log("Audio Call");
      rtcCall.caller = "wenke123";
      rtcCall.makeVoiceCall(tname);
    },
    // rtAcceptCall() {
    //   rtcCall.acceptCall();
    // },
    rtEndCall() {
      rtcCall.endCall();
    },
    createConfr() {
      emedia.mgr
        .createConference(emedia.mgr.ConfrType.COMMUNICATION)
        .then(function(confr) {
          console.log("创建会议成功");
          console.log(confr);
          resultCon = confr;
          emedia.mgr
            .joinConferenceWithTicket(
              resultCon.confrId,
              resultCon.ticket,
              "加入"
            )
            .then(function(confr) {
              console.log("加入成功");
              var videoCreate = document.getElementById("v1");
              var constaints = { audio: true, video: true };
              emedia.mgr
                .publish(constaints, videoCreate, "发布视频流")
                .then(function(pushedStream) {
                  //stream 对象
                })
                .catch(function(error) {
                  console.log(error);
                });
              // emedia.mgr
              //   .publish(constaints, ext)
              //   .then(function(pushedStream) {
              //     //stream 对象
              //     //如果需要将这个stream对象 显示，需要 emedia.mgr.streamBindVideo(videoTag, pushedStream)
              //   })
              //   .catch(function(error) {});
            })
            .catch(function(error) {
              console.log("加入失败");
            });
        })
        .catch(function(error) {
          console.log("创建会议失败");
        });
    },
    pushVideo() {
      var videoPush = document.getElementById("v1");
      emedia.mgr
        .publish({ audio: true, video: true }, videoPush, "创建者加入会议")
        .then(function(pushedStream) {
          //stream 对象
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    inviteUserText() {
      var uname = document.getElementById("name").value;
      var toname = document.getElementById("toname").value;
      var tomsg = document.getElementById("msg").value;
      var id = conn.getUniqueId();
      var msg = new WebIM.message("txt", id);
      msg.set({
        msg: "快来加入会议 - " + resultCon.confrId, // 消息内容
        to: toname, // 接收消息对象（用户id）
        roomType: false,
        ext: {
          conferenceId: resultCon.confrId,
          password: resultCon.password,
          msg_extension: { inviter: uname }
        },
        success: function(id, serverMsgId) {
          console.log("send private text Success");
          console.log(id, serverMsgId);
        },
        fail: function(e) {
          console.log("Send private text error");
        }
      });
      conn.send(msg.body);
      console.log(msg.body);
    },
    inviteUser() {
      var uname = document.getElementById("name").value;
      var tname = document.getElementById("toname").value;
      var tmsg = document.getElementById("msg").value;
      var id = conn.getUniqueId(); //生成本地消息id
      var msg = new WebIM.message("cmd", id); //创建命令消息
      msg.set({
        msg: "邀请您加入会议" + resultCon.confrId,
        to: tname, //接收消息对象
        action: "action", //用户自定义，cmd消息必填
        ext: {
          // confrId: resultCon.confrId,
          // password: resultCon.password,
          // jid: WebIM.config.appkey + "_" + tname + "@" + WebIM.config.Host
          "conferenceId": resultCon.confrId,
          "password": resultCon.password,
          "msg_extension": { inviter: uname }
        },

        success: function(id, serverMsgId) {
          console.log("send private cmd Success");
        },
        fail: function(e) {
          console.log("Send private cmd error");
        }
      });
      msg.body.chatType = "singleChat";
      conn.send(msg.body);
    },
    newinvite(){
      var toname = document.getElementById("toname").value;
      var jid = WebIM.config.appkey + '_' + toname + '@' + WebIM.config.Host
      rtcCall.inviteConference(resultCon.confrId, resultCon.password,jid )
    },
    removeUser() {
      console.log(memberNames);
      // emedia.mgr
      //     .kickMembersById(resultCon, [memberNames])
      //   .then(function() {})
      //   .catch(function(error) {});

      emedia.mgr
        .kickMember([memberNames])
        .then(function() {
          console.log("踢人成功");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    endConVideo() {
      var rtn = confirm("确定退出会议吗？");
      if (rtn) {
        emedia.mgr.exitConference();
      }
    },

    desktopWith() {
      /**
       * videoConstaints {screenOptions: ['screen', 'window', 'tab']} or true
       * withAudio： true 携带语音，false不携带
       * videoTag 可缺失，如果有 此次publish的媒体数据将会在这个video上显示 将会与stream绑定
       * ext 用户自定义扩展，其他成员可以看到这个字段
       *
       */
      var videoConstaints = { screenOptions: ["screen", "window", "tab"] };
      var withAudio = true;
      var videoDesk = document.getElementById("v3");
      var ext = "开启桌面共享";
      emedia.mgr
        .shareDesktopWithAudio(videoConstaints, withAudio, videoDesk, ext)
        .then(function(pushedStream) {
          //stream 对象
          console.log("桌面共享成功");
        })
        .catch(function(error) {});
      // emedia.mgr
      //   .shareDesktopWithAudio()
      //   .then(function(publishedStream) {
      //     console.log("共享成功");
      //   })
      //   .catch(function(error) {
      //     displayEvent(error);
      //   });
    },

    csJoinConfer() {
      var Conferid = document.getElementById("conferId").value;
      var conferpwd = document.getElementById("conferPwd").value;
      emedia.mgr
        .joinConference(Conferid, conferpwd, "test")
        .then(function(confr) {
          console.log("加入成功");
        })
        .catch(function(error) {});
    }
  }
};
</script>
<style>
div {
  text-align: left;
}
video {
  border: 1px solid red;
  width: 300px;
  height: 200px;
}
</style>
