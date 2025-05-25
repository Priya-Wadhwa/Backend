const Chat = require('../models/chatModel');

exports.createChat = async (req, res) => {
  let validation = '';

  if (!req.body.clientId) {
    validation += 'clientId is required.';
  }
  if (!req.body.freelancerId) {
    validation += 'freelancerId is required.';
  }
  if (!req.body.message) {
    validation += 'message are Required ';
  }
  if (!req.body.fromId) {
    validation += 'fromId are Required ';
  }

  if (!!validation) {
    res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    let prevChat = await Chat.findOne({
      clientId: req.body.clientId,
      freelancerId: req.body.freelancerId,
    });
    if (!prevChat) {
      const totalChat = await Chat.countDocuments();
      const { fromId, message } = req.body;
      let chat = new Chat();
      chat.autoId = totalChat + 1;
      chat.clientId = req.body.clientId;
      chat.freelancerId = req.body.freelancerId;
      let newMessage = {
        fromId,
        message,
      };
      chat.messages = [newMessage];

      chat
        .save()
        .then((newChat) => {
          res.send({
            success: true,
            status: 201,
            message: 'New chat created!!',
            data: newChat
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            status: 500,
            message: err.message,
          });
        });
    } else {
      const newMessage = {
        fromId: req.body.fromId,
        message: req.body.message,
      };
      prevChat.messages.push(newMessage);
      prevChat
        .save()
        .then((result) => {
          res.send({
            success: true,
            status: 200,
            message: 'Chat Updated',
            data: result,
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            status: 500,
            message: err.message,
          });
        });
    }
  }
};

exports.viewChat = (req, res) => {
  let validation = '';
  if (!req.body.userId) {
    validation += 'userId is required';
  }
  if (!!validation) {
    return res.json({
      success: false,
      status: 400,
      message: 'Validation Error : ' + validation,
    });
  } else {
    Chat.find({
      $or: [{ clientId: req.body.userId }, { freelancerId: req.body.userId }],
    })
      .exec()
      .then((result) => {
        res.send({
          success: true,
          status: 200,
          message: 'All chat Loaded',
          total: result.length,
          data: result,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      });
  }
};

exports.singleChat = (req, res) => {
  let validation = '';
  if (!req.body.fromId) {
    validation = 'fromId is required';
  }
  if (!req.body.toId) {
    validation = 'toId is required';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error ' + validation,
    });
  } else {
    // Find one function for view Single skill by _id
    Chat.find({
      $or: [
        {
          $and: [
            { clientId: req.body.fromId },
            { freelancerId: req.body.toId },
          ],
        },
        {
          $and: [
            { clientId: req.body.toId },
            { freelancerId: req.body.fromId },
          ],
        },
      ],
    })
    .populate('messages.fromId','name')
      .exec()
      .then((result) => {
        if (result.length == 0) {
          // null id valodation
          return res.send({
            success: false,
            status: 404,
            message: 'chat does not exist',
          });
        } else {
          let chat = result[0]  
          let messages = []
          messages = chat.messages
          chat.messages = messages.filter((x)=>{return x.status==true})
          res.send({
            success: true,
            status: 200,
            message: 'single chat response',
            data: chat,
          });
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          status: 500,
          message: err.message,
        });
      });
  }
};

exports.delMessage = (req, res) => {
  let validation = ""
  if (!req.body._id) {
    validation += "_id is required"
  }
  if (!req.body.index) {
    validation += "index is required"
  }

  if (!!validation) {
    return res.json({
      success: false,
      status: 400,
      message: "Validation Error " + validation
    })
  }
  else {
    Chat.findOne({ _id: req.body._id }).exec()
      .then((chatData) => {
        if (chatData == null) {
          return res.json({
            success: false,
            status: 400,
            message: "Chat Does not exist"
          })
        }
        else {
          let messageArray = chatData.messages
          messageArray[Number(req.body.index)].status = false

          chatData.messages = messageArray
          chatData.save()
            .then(updatedData => {
              return res.json({
                success: true,
                status: 200,
                message: "Message Deleted",
                updatedData
              })
            })
            .catch()
        }
      })
      .catch()
  }
}

// exports.allChat = async (req, res) => {
//   let validation = '';
//   if (!req.body.userId) {
//     validation += 'userId is required';
//   }
//   if (!!validation) {
//     return res.send({
//       success: false,
//       status: 400,
//       message: 'Validation Error : ' + validation,
//     });
//   } else {
//     const chats = await Chat.find({
//       $or: [{ clientId: req.body.userId }, { freelancerId: req.body.userId }],
//     });

//     if (chats.length == 0) {
//       return res.send({
//         success: false,
//         status: 404,
//         message: 'chat does not exist',
//       });
//     } else {
//       return res.send({
//         success: true,
//         status: 200,
//         data: {
//           chats,
//         },
//       });
//     }
//   }
// };
