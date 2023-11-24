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
      "con  làm được gì không😤",
      "con  chỉ biết phản kháng🤭=))",
      "tk ngu  phản kháng di😏?",
      "con mẹ m đang cầu xin t tha cho m kìa  😏",
      "thg ngu  ăn cứt của anh mà =)))",
      "m đang cầu xin a tha mà dko  :)))",
      "m bị a hành mà  cầu xin a tha đi thg dốt =))))",
      "con  bị a chửi đến mức phải cầu cứu ae mà =))))",
      "thg tật mồ côi  lmj có ba mẹ nè =))))",
      "m có ba mẹ như t k  :))))",
      "m lmj có dko  :)))))",
      "m nhà cùng bà ngoại u70 mà dko  =))))",
      "con  đc bả lấy dú 20cm cho bú :)))",
      "tk lồn  ngậm đắng nuốt cay :))",
      "ngôn m phèn dữ v  :)))))",
      "tao chửi chư mắng mẹ m nằm suy ngẫm mà con 😎",
      "con  bất lực mà :)))",
      "anh nói v m còn phản kháng dc à  :))))",
      "m bất hiếu v  :))))))",
      "m đang làm trò hề ai xem v thg dốt  :))))",
      "t đang xem m lm trò hề nè ",
      "thg ngu  đang cùng đồng bọn của nó làm trò hề cho t xem kìa clm :)))))",
      "mấy con chó sủa lẹ đi ",
      "sủa mẹ mày lên đi ",
      " cay rồi",
      "học ăn học nói học đâu ra cái thứ chảnh lồn v ",
      "tk ngu  mặt cặc mà đòi sủa",
      "tk ngu  làm set đi",
      "tk  não bò",
      "con  làđĩ đú của fb mà 🤣🤣",
      "mày treo rồi à  ",
      "con  cay quá nên treo mẹ rồi",
      "nhất quyết muốn win bọn bố à ",
      "lũ  ăn hại mxh thì lm ra trò j",
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
