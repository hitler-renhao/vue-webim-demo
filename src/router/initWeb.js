import config from '../../static/WebIM-v3'
// import config from '../../static/WebIMConfig'

//初始化IM SDK
var conn = {};
WebIM.config = config;
conn = WebIM.conn = new WebIM.default.connection({
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  url: WebIM.config.xmppURL,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  isStropheLog: WebIM.config.isStropheLog,
  delivery: WebIM.config.delivery
})

//注册回调监听
conn.listen({
  onOpened: function (message) {
    //连接成功回调
    var myDate = new Date().toLocaleString();

    console.log("%c [opened] 连接已成功建立", "color: green");
    console.log(myDate);
    alert(myDate + "登陆成功");
  },
  onClosed: function (message) {
    console.log("onclose:" + message);
  }, //连接关闭回调
  onError: function (message) {
    console.log("onError: ", message);
    alert("onError: ", message);
  }, //失败回调
  onTextMessage: function (message) {
    console.log("onTextMessage: ", message);
    if (message.ext[0].stringValue != undefined) {
      var truthBeTold = window.confirm((message.from + "邀请您加入会议"));
      if (truthBeTold) {
        emedia.mgr.joinConference(message.ext[0].stringValue, message.ext[2].stringValue, "进入会议").then(function () {
          console.log("********加入会议成功*******")
          // emedia.mgr.shareVideoWithAudio({
          // });
        }).catch(function (error) {
          console.log("加入会议失败")
        })
      } 
    }
  }, //收到文本消息
  onEmojiMessage: function (message) {
    console.log("onEmojiMessage: ", message);
  }, //收到表情消息
  onPictureMessage: function (message) {
    console.log("onPicMessage: ", message);
    $("#log").append("<div><img src = " + message.url + "/></div>")
  }, //收到图片消息
  onCmdMessage: function (message) {
    console.log('onCmdMessage: ', message);
    if (message.ext.conferenceId != undefined) {
      var truthBeTold = window.confirm((message.from + "邀请您加入会议"));
      if (truthBeTold) {
        emedia.mgr.joinConference(message.ext.conferenceId, message.ext.password, "进入会议").then(function () {
          console.log("********加入会议成功*******")
          // emedia.mgr.shareVideoWithAudio({
          // });
        }).catch(function (error) {
          console.log("加入会议失败")
        })
      } 
    }
  }, //收到命令消息
  onAudioMessage: function (message) {
    console.log("onAudioMessage: ", message);
    var options = {
      url: message.url
    };
    options.onFileDownloadComplete = function (response) {
      var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
      var audio = document.createel;
      audio = document.createElement('audio');
      document.body.appendChild(audio);
      audio.src = objectURL;
      audio.controls = true
    };
    options.onFileDownloadError = function () {
    };
    options.headers = {
      'Accept': 'audio/mp3'
    };
    WebIM.utils.download.call(conn, options);
  }, //收到音频消息
  onLocationMessage: function (message) {
    console.log("onLocMessage: ", message);
  }, //收到位置消息
  onFileMessage: function (message) {
    console.log("onFileMessage: ", message);
  }, //收到文件消息
  recallMessage: function (message) {
    console.log("recallMessage", message);
  }, //消息撤回
  onVideoMessage: function (message) {
    console.log("onVideoMessage: ", message);
    var node = document.getElementById("privateVideo");
    var option = {
      url: message.url,
      headers: {
        Accept: "audio/mp4"
      },
      onFileDownloadComplete: function (response) {
        var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
        node.src = objectURL;
      },
      onFileDownloadError: function () {
        console.log("File down load error.");
      }
    };
    WebIM.utils.download.call(conn, option);
  }, //收到视频消息
  onPresence: function (message) {
    var myDate = new Date().toLocaleString();
    console.log("onPresence: ", myDate + JSON.stringify(message));
    switch (message.type) {
      case "subscribe": // 对方请求添加好友
        console.log("收到好友请求")
        var friendRq = confirm(message.from + "申请加您为好友");
        if (friendRq == true) {
          // 同意对方添加好友
          conn.subscribed({
            to: message.from,
            message: "[resp:true]"
          },
            console.log("同意添加好友")
          );
        } else {
          // 拒绝对方添加好友
          conn.unsubscribed({
            to: message.from,
            message: "rejectAddFriend" // 拒绝添加好友回复信息
          });
        }
        break;
      case "subscribed": // 对方同意添加好友，已方同意添加好友
        break;
      case "unsubscribe": // 对方删除好友
        break;
      case "unsubscribed": // 被拒绝添加好友，或被对方删除好友成功
        break;
      case "memberJoinPublicGroupSuccess": // 成功加入聊天室
        console.log("join chat room success" + myDate);
        console.log(new Date().toLocaleString());
        break;
      case "joinChatRoomFaild": // 加入聊天室失败
        console.log("join chat room faild");
        break;
      case "joinPublicGroupSuccess": // 意义待查
        console.log("join public group success", message.from);
        break;
      case "createGroupACK":
        conn.createGroupAsync({
          from: message.from,
          success: function (option) {
            console.log("Create Group Succeed");
          }
        });
        break;
    }
  }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function (message) {
    console.log("Roster");
  }, //处理好友申请
  onInviteMessage: function (message) {
    console.log("Invite");
  }, //处理群组邀请
  onOnline: function () {
    console.log("onOnline");
  }, //本机网络连接成功
  onOffline: function () {
    console.log("offline");
  }, //本机网络掉线
  onBlacklistUpdate: function (list) {
    //黑名单变动
    // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
    console.log(list);
  },
  onReceivedMessage: function (message) {
    console.log("onReceivedMessage: ", message);
  }, //收到消息送达服务器回执
  onDeliveredMessage: function (message) {
    console.log("onDeliveredMessage：", message);
  }, //收到消息送达客户端回执
  onReadMessage: function (message) {
    console.log("onReadMessage: ", message);
  }, //收到消息已读回执
  onCreateGroup: function (message) {
    console.log("onCreateGroup: ", message);
  }, //创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function (message) {
    console.log("onMutedMessage: ", message);
  } //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

//初始化音视频
// 初始化WebRTC Call
var rtcCall = {};
if (WebIM.WebRTC) {
  rtcCall = new WebIM.WebRTC.Call({
    connection: conn,
    mediaStreamConstaints: {
      audio: true,
      video: true
    },
    listener: {
      onAcceptCall: function (from, options) {
        console.log("onAcceptCall::", "from: ", from, "options: ", options);
      },
      onGotRemoteStream: function (stream, streamType) {
        console.log(
          "onGotRemoteStream::",
          "stream: ",
          stream,
          "streamType: ",
          streamType
        );
        var video = document.getElementById("v1");
        video.srcObject = stream;
      },
      onGotLocalStream: function (stream, streamType) {
        console.log(
          "onGotLocalStream::",
          "stream:",
          stream,
          "streamType: ",
          streamType
        );
        var video = document.getElementById("v2");
        video.srcObject = stream;
      },
      onRinging: function (caller) {
        console.log("onRinging::", "caller:", caller);
        var ring = confirm("邀请您进行视频通话");
        if (ring == true) {
          rtcCall.acceptCall();
        }
        else {
          rtcCall.endCall();
        }
      },
      onTermCall: function (reason) {
        console.log("onTermCall::");
        console.log("reason:", reason);
      },
      onIceConnectionStateChange: function (iceState) {
        console.log("onIceConnectionStateChange::", "iceState:", iceState);
      },
      onError: function (e) {
        console.log(e);
        if (e.event.name == "NotAllowedError") {
          alert("没有摄像头，请检查设备")
          rtcCall.endCall();
        }
      }
    }
  });
} else {
  console.warn("不能进行视频通话！您的浏览器不支持webrtc或者协议不是https。");
}

var memberNames = {};
//有人加入会议，其他人调用joinXX等方法，如果加入成功，已经在会议中的人将会收到
// emedia.mgr.onMemberJoined = function(member) {
//   memberNames = member.name;
//   console.log(member.role);
//   console.log(JSON.stringify(member.name) + "加入会议");
// };
emedia.mgr.onMemberJoin = function (member) {
  memberNames = member.name;
  console.log(JSON.stringify(member.name) + "加入会议");
};
//有人退出会议
emedia.mgr.onMemberExited = function (member) {
  console.log(JSON.stringify(member.name) + "退出会议");
};
//有媒体流添加；比如 自己调用了publish方法（stream.located() === true时），或其他人调用了publish方法。
emedia.mgr.onStreamAdded = function (member, stream) {
  console.log("媒体流发布者" + JSON.stringify(member));
  var located = stream.located();
  if (located) {
    //stream.located() === true, 是自己发布刚刚发布的流
    // emedia.mgr.streamBindVideo(stream, v1);
  } else {
    // emedia.mgr.streamBindVideo(stream, localVideo);
    emedia.mgr.subscribe(member, stream, true, true, v2);
  }
  //用户提供的代码
  // if (stream.located()) {
  //   emedia.mgr.streamBindVideo(video, pushedStream);
  //   console.log('自己流')
  // } else {
  //   $("#log").append(
  //     '<video id="localVideo" style="border: 1px solid red" autoplay></video>'
  //   );
  //   emedia.mgr.streamBindVideo(stream, localVideo)
  //   emedia.mgr.subscribe(member, stream, true, true, localVideo)
  // }
};
//有媒体流移除
emedia.mgr.onStreamRemoved = function (member, stream) {
  console.log(JSON.stringify(member.name) + "媒体流退出");
};

emedia.mgr.setUrlCreator(function (url, apiName) {
  var restApi = emedia.util.parseURL("rest");
  if (!restApi) {
    restApi = "https://a1.easemob.com";
  }
  return restApi + url;
});

//角色改变
emedia.mgr.onRoleChanged = function (role) {
  console.log("角色改变成功");
  //会议退出；自己主动退 或 服务端主动关闭；
  emedia.mgr.onConferenceExit = function (reason, failed) {
    reason = reason || 0;
    switch (reason) {
      case 0:
        reason = "正常挂断";
        break;
      case 1:
        reason = "没响应";
        break;
      case 2:
        reason = "服务器拒绝";
        break;
      case 3:
        reason = "对方忙";
        break;
      case 4:
        reason = "失败,可能是网络或服务器拒绝";
        if (failed === -9527) {
          reason = "失败,网络原因";
        }
        if (failed === -500) {
          reason = "Ticket失效";
        }
        if (failed === -502) {
          reason = "Ticket过期";
        }
        if (failed === -504) {
          reason = "链接已失效";
        }
        if (failed === -508) {
          reason = "会议无效";
        }
        if (failed === -510) {
          reason = "服务端限制";
        }
        break;
      case 5:
        reason = "不支持";
        break;
      case 10:
        reason = "其他设备登录";
        break;
      case 11:
        reason = "会议关闭";
        break;
    }
  };
};

export { conn, rtcCall, memberNames };