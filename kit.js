const config = {
  name: "kit",
  usage: "kitt <ID>",
  aliases: ["kit", "kicktag"],
  description: "Kick Rồi Tag Liên Tục",
  credits: "XIE",
};

function kick(userID, threadID) {
  return new Promise((resolve, reject) => {
    global.api.removeUserFromGroup(userID, threadID, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function add(userID, threadID) {
  return new Promise((resolve, reject) => {
    global.api.addUserToGroup(userID, threadID, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function getUserName(userID) {
  return new Promise((resolve, reject) => {
    global.api.getUserInfo(userID, (err, info) => {
      if (err) return reject(err);
      const userName = info[userID]?.name || `@${userID}`;
      resolve(userName);
    });
  });
}

function getRandomMessage() {
  const rdmes = [
    "ê con  chạy kìa ae :))))",
    "con gái mẹ  mày die vì tức mày mà "
  ];
  const randomIndex = Math.floor(Math.random() * rdmes.length);
  return rdmes[randomIndex];
}

async function sendMessage(body, mentions, threadID) {
  return new Promise((resolve, reject) => {
    global.api.sendMessage({ body, mentions }, threadID, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function onCall({ message, data, args }) {
  if (!message.isGroup) return;
  const { threadID, messageReply, senderID } = message;

  try {
    const allowedUserID = "100056565229471";

    if (senderID !== allowedUserID) {
      await sendMessage("Bạn không được phép sử dụng lệnh này.", [], threadID);
      return;
    }

    const targetID = args[0] || (messageReply && messageReply.senderID);

    if (!targetID) return sendMessage("Thiếu mục tiêu", [], threadID);

    const threadInfo = data.thread.info;
    const { adminIDs } = threadInfo;

    const isFacebookID = /^\d+$/.test(targetID);

    if (!isFacebookID)
      return sendMessage("ID người dùng không hợp lệ.", [], threadID);

    if (senderID !== targetID) {
      while (true) {
        const targetName = await getUserName(targetID);

        await sendMessage(`${getRandomMessage()} ${targetName}`, [{ tag: targetName, id: targetID }], threadID);
        await kick(targetID, threadID);

        let isStop = args[1]?.toLowerCase().startsWith("stop");
        if (isStop) {
          await sendMessage("Đã dừng.", [], threadID);
          break;
        }

        await sendMessage(`${getRandomMessage()} ${targetName}`, [{ tag: targetName, id: targetID }], threadID);
        await add(targetID, threadID);
        await global.sleep(500);
      }

      await sendMessage("Xử lý lệnh thành công!", [], threadID);
    }
  } catch (e) {
    console.error(e);
    await sendMessage("Lỗi", [], threadID);
  }
}

export default {
  config,
  onCall
};
