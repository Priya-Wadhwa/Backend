const Bid = require('./../models/bidModel');

exports.createBid = async (req, res) => {
  const { clientId, freelancerId, projectId, poc, description, duration, bidAmount } =
    req.body;
  const totalBids = await Bid.countDocuments();

  let validation = '';

  if (!clientId) {
    validation += 'clientId is Required ';
  }
  if (!projectId) {
    validation += 'projectId is Required ';
  }
  if (!freelancerId) {
    validation += 'freelancerId is Required ';
  }
  if (!req.file) {
    validation += 'poc is Required ';
  }
  if (!description) {
    validation += 'description is Required ';
  }
  if (!duration) {
    validation += 'duration is Required ';
  }
  if(!bidAmount){
    validation +="Bid Amount is required"
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    let bid = new Bid();
    bid.autoId = totalBids + 1;
    bid.clientId = clientId;
    bid.projectId = projectId;
    bid.freelancerId = freelancerId;
    bid.poc = "poc/"+req.file.filename;
    bid.description = description;
    bid.duration = duration;
    bid.bidAmount = bidAmount;

    bid
      .save()
      .then((bid) => {
        res.send({
          success: true,
          status: 201,
          message: 'New bid created!!',
          data: {
            bid,
          },
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

exports.getAllBids = (req, res) => {

  Bid.find(req.body)
    .populate('clientId')
    .populate('projectId')
    .populate('freelancerId')
    .sort({ createdAt: -1 })
    .exec()
    .then((bids) => {
      res.send({
        success: true,
        status: 200,
        message: 'All bids found!',
        data: bids
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        status: 500,
        message: err.message,
      });
    });
};

exports.getBid = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required.';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Bid.findOne({ _id: req.body._id })
      .populate('clientId')
      .populate('projectId')
      .populate('freelancerId')
      .exec()
      .then((bid) => {
        if (bid == null) {
          return res.send({
            success: false,
            status: 404,
            message: 'Bid does not exist!',
          });
        } else {
          return res.send({
            success: true,
            status: 200,
            message: 'Bid found!',
            data: bid
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

exports.clientUpdateBid = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required.';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Bid.findOne({ _id: req.body._id })
      .exec()
      .then((bid) => {
        if (bid == null) {
          res.send({
            success: false,
            status: 404,
            message: 'Bid does not exists!',
          });
        } else {
          if (!!req.body.status) {
            bid.status = req.body.status;
          }
          bid
            .save()
            .then((updatedBid) => {
              res.send({
                success: true,
                status: 200,
                message: 'Bid updated!',
                data: {
                  bid: updatedBid,
                },
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

exports.freelancerUpdateBid = (req, res) => {
  let validation = '';

  if (!req.body._id) {
    validation += 'id is required.';
  }

  if (!!validation) {
    return res.send({
      success: false,
      status: 400,
      message: 'Validation Error: ' + validation,
    });
  } else {
    Bid.findOne({ _id: req.body._id })
      .exec()
      .then((bid) => {
        if (bid == null) {
          res.send({
            success: false,
            status: 404,
            message: 'Bid does not exists!',
          });
        } else {
          if (!!req.body.bidAmount) {
            bid.bidAmount = req.body.bidAmount;
          }
          if (!!req.file) {
            bid.poc ="poc/"+ req.file.filename;
          }
          if (!!req.body.description) {
            bid.description = req.body.description;
          }
          if (!!req.body.duration) {
            bid.duration = req.body.duration;
          }
          if (!!req.body.status) {
            bid.status = req.body.status;
          }
          bid
            .save()
            .then((updatedBid) => {
              res.send({
                success: true,
                status: 200,
                message: 'Bid updated!',
                data: {
                  bid: updatedBid,
                },
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
