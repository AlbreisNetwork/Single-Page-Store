<?php session_start(); ?>
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/" />
    <title>Single Page Store - Most fast solution for small e-commerce business</title>
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap-grid.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap-reboot.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" type="text/css" href="style.css?v=<?=time()?>" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js"></script>
    <script src="script.js?v=<?=time()?>"></script>
  </head>
  <body>
    <header>
      <div class="row">
        <div class="col-2 text-center">
          <button class="btn-menu" type="button"><span class="fa fa-bars"></span></button>
        </div>
        <div class="col-8 text-center">
          <div class="logo">Single Page Store</div>
        </div>
        <div class="col-2 text-center">
          <form id="form-search" action="">
            <input name="s" placeholder="Pesquisar produtos" />
            <button class="btn-search" type="submit"><span class="fa fa-search"></span></button>
          </form>
        </div>
      </div>
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
    </header>
    <section id="products" class="container">
      <div class="row">
        <div class="col-12">
          <div class="products row">
          </div>
        </div>
        
      </div>
    </section>
    <section id="checkout">
      <button class="checkout-button" type="button">Finalizar compra</button>
      <div class="row">
        <div class="col-4 step cart-step">
          <button type="button"> <span class="fa fa-shopping-cart"></span> <span class="items-count"></span> <span class="fa fa-check"></span><small class="cart-total"></small></button>
          <div id="cart">
            <div class="row">
              
            </div>
          </div>
        </div>
        <div class="col-4 step shipping-step">
          <button type="button"><span class="fa fa-truck"></span> Frete <span class="fa fa-check"></span><small class="shipping-cost"></small></button>
          <div id="shipping">
            <form method="post">
              <div class="shipping-container">
                <h3>1 - Preencha o endereço <span class="fa fa-chevron-down pull-right"></span></h3>
                <div>
                  <label>Rua</label>
                  <input type="text" name="street" />
                  <div class="row">
                    <div class="col-6">
                      <label>Número</label>
                      <input type="text" name="street_number" />
                    </div>
                    <div class="col-6">
                      <label>Complemento</label>
                      <input type="text" name="complement" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <label>Bairro</label>
                      <input type="text" name="neightbourhood" />
                    </div>
                    <div class="col-6">
                      <label>Cidade</label>
                      <input type="text" name="city" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <label>Estado</label>
                      <input type="text" name="state" />
                    </div>
                    <div class="col-6">
                      <label>País</label>
                      <input type="text" name="country" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="shipping-container">
                <h3>2 - Escolha o tipo de frete <span class="fa fa-chevron-down pull-right"></span></h3>
                <div>
                  <div class="shipping-methods">
                    <div class="shipping-method">
                      <h4>Correios</h4>
                      <label class="selectable">
                        <input type="radio" name="method" value="PAC" /><div><span class="fa fa-check-square"></span> PAC</div>
                      </label>
                      <label class="selectable">
                        <input type="radio" name="method" value="Sedex" /><div><span class="fa fa-check-square"></span> Sedex</div>
                      </label>
                    </div>
                    <div class="shipping-method">
                      <h4>Motoboy</h4>
                      <label class="selectable">
                        <input type="radio" name="method" value="Motoboy - Tramandaí - Centro" /><div><span class="fa fa-check-square"></span> Tramandaí - Centro</div>
                      </label>
                      <label class="selectable">
                        <input type="radio" name="method" value="Motoboy - Imbé - Centro" /><div><span class="fa fa-check-square"></span> Imbé - Centro</div>
                      </label>
                    </div>
                    <div class="shipping-method">
                      <h4>Retirar na loja</h4>
                      <label class="selectable">
                        <input type="radio" name="method" value="Retirar na loja - Centro" /><div><span class="fa fa-check-square"></span> Retirar na loja - Centro</div>
                      </label>
                      <label class="selectable">
                        <input type="radio" name="method" value="Retirar na loja - Litoral" /><div><span class="fa fa-check-square"></span> Retirar na loja - Litoral</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button">Salvar</button>
            </form>
          </div>
        </div>
        <div class="col-4 step billing-step">
          <button type="button"><span class="fa fa-money"></span> Pagar <span class="fa fa-check"></span><small class="billing-cost"></small></button>
          <div id="billing">
            <form method="post">
              <div class="billing-container">
                <h3>1 - Preencha os dados <span class="fa fa-chevron-down pull-right"></span></h3>
                <div>
                  <div class="row">
                    <div class="col-12 col-md-4">
                  <label>Nome</label>
                  <input type="text" name="firstname" />
                </div>
                    <div class="col-12 col-md-4">
                  <label>Sobrenome</label>
                  <input type="text" name="lastname" />
                </div>
                    <div class="col-12 col-md-4">
                  <label>CPF</label>
                  <input type="text" name="document" />
                </div>
                    <div class="col-12 col-md-4">
                  <label>E-mail</label>
                  <input type="text" name="email" />
                </div>
                    <div class="col-6 col-md-4">
                      <label>DDD</label>
                      <input type="text" name="ddd" />
                    </div>
                    <div class="col-6 col-md-4">
                      <label>Telefone</label>
                      <input type="text" name="phone_number" />
                    </div>
                </div>
                  <div class="row">
                    <div class="col-12 col-md-7">
                  <label>Rua</label>
                  <input type="text" name="street" />
                </div>
                    <div class="col-6 col-md-2">
                      <label>Número</label>
                      <input type="text" name="street_number" />
                    </div>
                    <div class="col-6 col-md-3">
                      <label>Complemento</label>
                      <input type="text" name="complement" />
                    </div>
                    <div class="col-6 col-md-4">
                      <label>Bairro</label>
                      <input type="text" name="neightbourhood" />
                    </div>
                    <div class="col-6 col-md-4">
                      <label>Cidade</label>
                      <input type="text" name="city" />
                    </div>
                    <div class="col-6 col-md-2">
                      <label>Estado</label>
                      <input type="text" name="state" />
                    </div>
                    <div class="col-6 col-md-2">
                      <label>País</label>
                      <input type="text" name="country" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="billing-container">
                <h3>2 - Método de pagamento <span class="fa fa-chevron-down pull-right"></span></h3>
                <div>
                  <div class="billing-methods row"></div>
                </div>
              </div>
              <button type="button">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </section>
    <footer>
      Desenvolvido por <strong>Albreis Network</strong>
    </footer>
  </body>
</html>