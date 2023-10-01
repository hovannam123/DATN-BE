import PaymentService from "../service/payment_service"
const paypal = require('paypal-rest-sdk');


let payment = async (req, res) => {

    let result = await PaymentService.payment(req.query.user_id, req.body.voucher_user_id)
    if (result.statusCode == 200) {
        return res.status(200).json(result)
    }
    else {
        return res.status(400).json(result)
    }

}

let paymentSuccess = async (req, res) => {
    let result = await PaymentService.paymentSuccess(req.query.PayerID, req.query.paymentId, req.query.user_id, req.query.voucher_user_id)
    if (result.statusCode == 200) {
        const html = `<!DOCTYPE html>
        <html>
        <head>
          <title>Thanh toán thành công</title>
          <style>
            /* CSS styling */
            body {
              font-family: Arial, sans-serif;
              text-align: center;
            }
            h1 {
              color: #2ecc71;
            }
            p {
              margin: 20px 0;
            }
            .success-icon {
              font-size: 48px;
              color: #2ecc71;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <i class="success-icon">✔</i>
            <h1>Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã mua hàng.</p>
            <p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng và giao hàng trong thời gian sớm nhất.</p>
            <p>Xin vui lòng kiểm tra email và điện thoại để cập nhật thông tin đơn hàng.</p>
          </div>
        </body>
        </html>`
        return res.send(html)
    }
    else {
        const html = `
        <!DOCTYPE html>
<html>
<head>
  <title>Thanh toán thất bại</title>
  <style>
    /* CSS styling */
    body {
      font-family: Arial, sans-serif;
      text-align: center;
    }
    h1 {
      color: #e74c3c;
    }
    p {
      margin: 20px 0;
    }
    .failure-icon {
      font-size: 48px;
      color: #e74c3c;
    }
  </style>
</head>
<body>
  <div class="container">
    <i class="failure-icon">✘</i>
    <h1>Thanh toán thất bại!</h1>
    <p>Xin lỗi, thanh toán của bạn không thành công.</p>
    <p>Vui lòng thử lại hoặc liên hệ với dịch vụ khách hàng để được hỗ trợ.</p>
  </div>
</body>
</html>
Trong template này, chúng ta sử dụng biểu tượng "X" và màu đỏ để tạo ra trạng thái thanh toán thất bại. Nội dung cũng được cung cấp để thông báo cho người dùng về việc thanh toán không thành công và cung cấp các hướng dẫn tiếp theo.

Tương tự như trạng thái thanh toán thành công, bạn có thể sử dụng cùng cách để định nghĩa một tuyến trong ứng dụng của bạn và gửi đoạn mã HTML trên khi có yêu cầu tương ứng.

`
        return res.send(
            html
        )
    }
}


module.exports = {
    payment,
    paymentSuccess
}