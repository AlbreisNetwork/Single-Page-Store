<?php session_start();
header('Access-Control-Allow-Origin: *');
//header('Access-Control-Allow-Headers: X-Authorization-Token, X-Authorization-Time, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Content-Type: text/html');
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composer's autoloader
require 'vendor/autoload.php';

$cart = json_decode($_POST['cart']);
function formatCurrency($n) {
return 'R$' . number_format($n, 2, ',', '.');
}
ob_start();
$shipping_methods = json_decode(file_get_contents('./shipping.json'));
$billing_methods = json_decode(file_get_contents('./billing.json'));
?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
<div style="width: 90%">
  <div class="row" id="order" style="background: #fff;padding: 30px 15px;width: 100%;">
    <div class="col-12">
      <h3>Itens do pedido</h3>
      <hr/>
      <div id="order-items">
      <div class="row">
        <?php foreach($cart->items as $item): ?>
        <div class="col-12 col-md-6 col-lg-4">
        <small class="item">
          <h4><?php echo $item->name; ?></h4>
          <div class="price"><strong>Valor:</strong> <?php echo formatCurrency($item->original_price); ?></div>
          <div class="quantidade"><strong>Quatidade comprada:</strong> <?php echo $item->quantidade; ?></div>
          <div class="attrs">
            <?php $attrs_price = 0; ?>
            <?php foreach($item->attrs as $key => $attr): ?>
            <div class="attr">
              <strong><?php echo $key ?>:</strong> <?php echo $attr->label ?>
              <?php if($attr->price):  $attrs_price += $attr->price; ?>
              (+<?php echo formatCurrency($attr->price) ?>)
              <?php endif; ?>
            </div>
            <?php endforeach; ?>
          </div>
        <div class="total"><strong>Total:</strong> <?php echo formatCurrency(($item->original_price * $item->quantidade) + $attrs_price); ?></div>
        </small><br/><br/>
        </div>
        <?php endforeach; ?>
      </div>
      </div>
      <div class="order-totals">
        <div><strong>Subtotal:</strong> <?php echo formatCurrency($cart->billing->subtotal); ?></div>
      </div>
    <hr/>
    </div>
    <?php if($cart->shipping->cost): ?>
      <div class="col-12">
        <h3>Endereço de entrega</h3>
        <hr/>
        <small id="order-shipping">
          <div><strong>Rua:</strong> <?php echo $cart->shipping->street; ?></div>
          <div><strong>Número:</strong> <?php echo $cart->shipping->street_number; ?></div>
          <div><strong>Complemento:</strong> <?php echo $cart->shipping->complement; ?></div>
          <div><strong>Bairro:</strong> <?php echo $cart->shipping->neightbourhood; ?></div>
          <div><strong>Cidade:</strong> <?php echo $cart->shipping->city; ?></div>
          <div><strong>UF:</strong> <?php echo $cart->shipping->state; ?></div>
          <div><strong>País:</strong> <?php echo $cart->shipping->country; ?></div>
          <div><strong>Método de envio:</strong> <?php echo $cart->shipping->method; ?></div>
        </small>
        <div class="order-totals">
          <div><strong>Frete:</strong> <?php echo formatCurrency($cart->shipping->cost); ?></div>
        </div>
        <hr/>
      </div>
    <?php endif; ?>
    <div class="col-12">
      <h3>Dados de pagamento</h3>
      <hr/>
      <small id="order-billing">
        <div><strong>Nome:</strong> <?php echo $cart->billing->firstname; ?></div>
        <div><strong>Sobrenome:</strong> <?php echo $cart->billing->lastname; ?></div>
        <div><strong>E-mail:</strong> <?php echo $cart->billing->email; ?></div>
        <div><strong>CPF/CNPJ:</strong> <?php echo $cart->billing->document; ?></div>
        <div><strong>Telefone:</strong> 
          (<?php echo $cart->billing->ddd; ?>) <?php echo $cart->billing->phone_number; ?></div>
        <div><strong>Rua:</strong> <?php echo $cart->billing->street; ?></div>
        <div><strong>Rua:</strong> <?php echo $cart->billing->street; ?></div>
        <div><strong>Número:</strong> <?php echo $cart->billing->street_number; ?></div>
        <div><strong>Complemento:</strong> <?php echo $cart->billing->complement; ?></div>
        <div><strong>Bairro:</strong> <?php echo $cart->billing->neightbourhood; ?></div>
        <div><strong>Cidade:</strong> <?php echo $cart->billing->city; ?></div>
        <div><strong>UF:</strong> <?php echo $cart->billing->state; ?></div>
        <div><strong>País:</strong> <?php echo $cart->billing->country; ?></div>
        <div><strong>Método de pagamento:</strong> <?php echo $cart->billing->method; ?></div>
        <div><?php echo $billing_methods->{$cart->billing->method}->description; ?></div>
      </small>
      <hr/>
      <small class="order-totals" style="color:red">
    <?php if($cart->shipping->cost): ?>
        <div><strong>Frete:</strong> <?php echo formatCurrency($cart->shipping->cost); ?></div>
    <?php endif; ?>
        <div><strong>Subtotal:</strong> <?php echo formatCurrency($cart->billing->subtotal); ?></div>
        <div><strong>Total:</strong> <?php echo formatCurrency($cart->billing->total); ?></div>
      </small>
    </div>
  <br/>
  <br/>
  <br/>
  <br/>
  </div>
  <?php if(!isset($_POST['sendmail'])): ?>
  <div style="padding: 0 15px">
    <script> window._cart = JSON.stringify(<?php echo json_encode($cart); ?>); </script>
  <button style="border:none;background:#ffd200;color:#111;line-height:50px;padding: 0 30px;" type="button" onclick="domtoimage.toJpeg(document.getElementById('order'), { quality: 0.95 })
    .then(function (dataUrl) {
      jQuery.post('/save.php', {sendmail: 1, cart: window._cart}, function(response){
        jQuery.fancybox.close('all');
        jQuery.fancybox.open(response);
      });
    });">CONFIRMAR PEDIDO</button>
  <br/>
  <br/>
  <p>* Revise os dados do pedido e depois clique em ENVIAR PEDIDO</p>
  <br/>
</div>
<?php endif; ?>
</div>
<?php
$output = utf8_decode(ob_get_contents());
ob_end_clean();
if(isset($_POST['sendmail'])) {

  $mail = new PHPMailer;                              // Passing `true` enables exceptions
  try {
      //$mail->isMail();                                      // Set mailer to use SMTP
      //Server settings
      $mail->SMTPDebug = 0;                                 // Enable verbose debug output
      $mail->isSMTP();                                      // Set mailer to use SMTP
      $mail->Host = 'smtp.sendgrid.net';  // Specify main and backup SMTP servers
      $mail->SMTPAuth = true;                               // Enable SMTP authentication
      $mail->Username = 'apikey';                 // SMTP username
      $mail->Password = '';                           // SMTP password
      $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
      $mail->Port = 2525;                                    // TCP port to connect to

      //Recipients
      $mail->setFrom('', '');
      $mail->addAddress('', '');     // Add a recipient
      $mail->addAddress($cart->billing->email, $cart->billing->firstname);               // Name is optional
      $mail->addReplyTo($cart->billing->email, $cart->billing->firstname);
      //$mail->addCC('cc@example.com');
      //$mail->addBCC('bcc@example.com');

      //Attachments
      //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
      //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

      //Content
      $mail->isHTML(true);                                  // Set email format to HTML
      $mail->Subject = 'Novo pedido';
      $mail->Body    = $output;
      $mail->AltBody = $output;

      $mail->send();
      if(isset($_POST['sendmail'])) 
        echo 'Mensagem enviada. Retornamenros em breve.';
  } catch (Exception $e) {
      if(isset($_POST['sendmail'])) 
        echo 'Message could not be sent. Mailer Error: ' . $e->getMessage();
  }
  exit;
}
if(!isset($_POST['sendmail']))
  echo $output;
?>