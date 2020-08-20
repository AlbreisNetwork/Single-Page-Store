// Checa se o carrinho está inicializado
if(!sessionStorage.cart) {
  // Se não existir cria o carrinho usando sessionStorage
  sessionStorage.setItem('cart', JSON.stringify({items: {}, total: 0, shipping: {}, billing: {}, payment: {}}));
}
/**
 * Formata moeda
 * @param  {[type]} n [description]
 * @return {[type]}   [description]
 */
function formatCurrency(n) {
  n = Number(n);
  if(!n) {
    return n;
  }
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });;
}

/**
 * Adiciona produto para o carrinho
 */
function addToCart(){
  // Captura o produto
  var product = jQuery(this).parents('.product');
  // Pega o ID
  var id = product.find('[name="id"]').val();
  ////console.log(id);
  var key = String(id);
  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);
  // Inicializa variavel que guarda os dados do produto adicionado
  var data = {};
  // Serializa o form do produto para obter os dados selecionados
  jQuery('#product' + id).find('form').serializeArray().map(function(item) {
    if ( data[item.name] ) {
        if ( typeof(data[item.name]) === "string" ) {
            data[item.name] = [data[item.name]];
        }
        data[item.name].push(item.value);
    } else {
        data[item.name] = item.value;
    }
  });

  // Mapeia as opcoes disponiveis
  var options = {};
  product.find('form input[type="radio"]').each(function(k, item){
    options[jQuery(item).attr('name')] = jQuery(item).val();
  });

  // Guarda as opcoes selecionadas
  data.attrs = {};
  product.find('form input[type="radio"]:checked').each(function(k, item){
    data.attrs[jQuery(item).attr('name')] = {label: jQuery(item).val(), price: jQuery(item).data('price')};
    key += jQuery(item).val();
  });

  // Verifica se todas as opções foram selecionadas
  for(i in options) {
    if(!data.attrs[i]) {
      alert('Selecione o campo: ' + i);  
      return false;  
    }
  }

  // Define chave do produto no carrinho
  data.key = key;
  if(cart.items[key]) {
    // Incrementa quantidade se o produto já estive no carrinho
    cart.items[key].quantidade = Number(1) + Number(cart.items[key].quantidade);
  } else {
    // Adiciona produto ao carrinho com quantidade 1
    cart.items[key] = data;
    cart.items[key].quantidade = 1;
  }

  // Salva carrinho atualizado no sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(cart));

  // Atualiza dados de pagamento
  updateBillingData();
  setTimeout(function(){ 
    // Atualiza HTML do pagamento
    checkBillingData(); 
    setTimeout(function(){
      jQuery('.checkout-button').hide();
      // Mostra botão de finalizar compra se tudo estiver correto
      if(checkCartData() && checkShippingData() && checkBillingData()) {
        jQuery('.checkout-button').show();
      }
      // Atualiza quantidade no botão de comprar
      jQuery('.cart-qty-' + id).html(cart.items[key].quantidade)

    }, 10)
  }, 10);
}

/**
 * Atualiza carrinho
 * @return {[type]} [description]
 */
function checkCartData(){
  var cart = JSON.parse(sessionStorage.cart);
  // Total do carrinho
  var total = 0;
  // Contagem de produtos
  var count = 0;
  // Html dos itens do carrinho
  var html = '';
console.log(cart.items)
  // Gera html do carrinho
  for(i in cart.items) {
    item = cart.items[i];
    var options = '';
    // Pega atributos selecionados
    if(item.attrs) {
      for(k in item.attrs){
        options += '<div><strong>' + k + ':</strong> ' + item.attrs[k].label + (item.attrs[k].price ? (' (+' + formatCurrency(item.attrs[k].price)) + ')': '') + '</div>';
      }
    }
    // Incrementa total do carrinho
    total += (item.quantidade * item.price)
    // Incrementa quantidade de items no carrinho
    count += item.quantidade;
    html += '<div class="col-12 col-sm-6 col-md-4 col-lg-3">';
    html += '<div class="cart-item">\
              <div class="row">\
                <div class="col-3">\
                  <div class="item-thumb">\
                    <img src="' + item.image + '" />\
                    <button class="remove-item" data-key="' + i + '">remover</button>\
                  </div>\
                </div>\
                <div class="col-9">\
                <div class="row">\
                  <div class="item-details">\
                    <div class="item-name">' + item.name + '</div>\
                    <div class="item-options">\
                      ' + options + '\
                    </div>\
                    <div class="item-qty-price">\
                      <div><strong>Valor:</strong> ' + formatCurrency(item.price) + '</div>\
                      <div><strong>Quantidade:</strong> ' + item.quantidade + '</div>\
                    </div>\
                  </div>\
                  </div>\
                </div>\
              </div>\
              </div>\
            </div>';
  }

  // Insere HTML no carrinho
  jQuery('#cart  > .row').html(html);

  // Atualiza total do carrinho
  cart.total = total;
  jQuery('.cart-total').html(formatCurrency(cart.total));

  // Atualiza subtotal a cobrar (items + frete)
  cart.billing.total = cart.shipping.cost ? (cart.shipping.cost + total) : total;
  // Atualiza total a cobrar (items + frete)
  cart.billing.subtotal = total;
  jQuery('.billing-cost').html(formatCurrency(cart.billing.total));

  // Atualiza quantidade de items no carrinho
  jQuery('.items-count').html(count + ' items');

  // Se tiver items no carrinho marca como OK
  jQuery('.cart-step .fa-check').hide();
  if(cart.total) { jQuery('.cart-step .fa-check').show(); }

  // Atualiza carrinho como novos dados
  sessionStorage.setItem('cart', JSON.stringify(cart));

  return cart.total;

}

/**
 * Atualiza dados de frete
 * @return {[type]} [description]
 */
function updateShippingData(){
  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);
  // Inicializa dados de entrega
  var data = {};
  // Captura dados do endereço de envio
  var shipping = jQuery('#shipping').find('form').serializeArray().map(function(item) {
    if ( data[item.name] ) {
        if ( typeof(data[item.name]) === "string" ) {
            data[item.name] = [data[item.name]];
        }
        data[item.name].push(item.value);
    } else {
        data[item.name] = item.value;
    }
  });

  // Verifica valores dos fretes
  jQuery.getJSON('/json/shipping.json', function(shipping_methods){
    
    // Inicia com custo 0
    data.cost = 0;

    // Verifica se o metodo de envio existe e se existe produto fisico a ser enviado
    if(shipping_methods[data.method] && hasShipping()) {
      // Se existir define o valor
      data.cost = shipping_methods[data.method].price;
    }

    // Atualiza dados de entrega
    cart.shipping = data;

    // Verifica se todos os dados de entrega foram preenchidos
    var check = cart.shipping.method;
    for(i in cart.shipping) {
      if(cart.shipping[i] == '' && check) {
        check = false;
      }
    }

    // Atualiza visualização dos dados de frete
    jQuery('.shipping-cost').html(!hasShipping() ? 'Não aplicável' : formatCurrency(cart.shipping.cost));

    // Atualiza carrinho com dados novos
    sessionStorage.setItem('cart', JSON.stringify(cart));

  });

  return check || !hasShipping();

}

function hasShipping(){

  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);

    // Verifica se carrinho so tem produto virtaul
    var _has_shipping = false;
    for(i in cart.items) {
      if(!cart.items[i].virtual && _has_shipping !== false) {
        _has_shipping = true;
      }
    }

    return _has_shipping;

}

// Atualiza visualização dos dados de frete
function checkShippingData(){

  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);

  // Cnofere se todos os dados do frete foram preenchidos
  check = cart.shipping.method;
  for(i in cart.shipping) {
    if(cart.shipping[i] == '' && check) {
      check = false;
    }
    if(i !== 'method') {
      jQuery('#shipping').find('[name="' + i + '"]').val(cart.shipping[i]);
    }
    if(cart.shipping.method) {
      jQuery('#shipping').find('[value="' + cart.shipping.method + '"]').click();
    }
  }
  
  // Atualiza visualização do custo do frete
  jQuery('.shipping-cost').html(!hasShipping() ? 'Não aplicável' : formatCurrency(cart.shipping.cost));

  // Marca ou não o passo como concluído se todos os dados foram preenchids
  jQuery('.shipping-step .fa-check').hide();
  //console.log(hasShipping())
  if(check || !hasShipping()) { jQuery('.shipping-step .fa-check').show(); }

  return check || !hasShipping();

}

/**
 * Atualiza dados de pagamento
 * @return {[type]} [description]
 */
function updateBillingData(){
  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);
  // Inicializa dados de pagamento
  var data = {};
  // Pega dados do formulário de pagamento
  var billing = jQuery('#billing').find('form').serializeArray().map(function(item) {
    if ( data[item.name] ) {
        if ( typeof(data[item.name]) === "string" ) {
            data[item.name] = [data[item.name]];
        }
        data[item.name].push(item.value);
    } else {
        data[item.name] = item.value;
    }
  });

  // Atualiza subtotal a pagar
  data.subtotal = cart.total;
  // Atualiza total a pagar
  
  console.log(cart.total)

  data.total = cart.shipping.cost ? (cart.shipping.cost + cart.total) : cart.total;

  // Atualiza dados de pagamento
  cart.billing = data;

  // Se não for remove todos os dados de cartão encontrados
  card_method_name = jQuery('[name="card_number"]').parents('.billing-method').find('.selectable input[type="radio"]').val();
  if(cart.billing.method != card_method_name) {
    delete cart.billing.card_number;
    delete cart.billing.card_holder;
    delete cart.billing.card_ccv;
    delete cart.billing.card_month;
    delete cart.billing.card_year;
  }


  // Confere se meio de pagamento é cartão de credito
  check = true;

  // Verifica se todos os campos foram preenchidos
  for(i in cart.billing) {
    if(cart.billing[i] == '' && check) {
      check = false;
    }
  }

  // Atualiza visualização dos dados de pagamento
  jQuery('.billing-cost').html(formatCurrency(cart.billing.total));

  // Atualiza carrinho com novos dados
  sessionStorage.setItem('cart', JSON.stringify(cart));
  
  return check;

}

// Atualiza visualização dos dados de pagamento
function checkBillingData(){
  // Inicializa objeto do carrinho
  var cart = JSON.parse(sessionStorage.cart);

  // Confere se todos os dados de pagamento foram preenchidos
  check = cart.billing.method;
  for(i in cart.billing) {
    if(cart.billing[i] == '' && check) {
      check = false;
    }
    if(i !== 'method') {
      jQuery('#billing').find('[name="' + i + '"]').val(cart.billing[i]);
    }
    if(cart.billing.method) {
      jQuery('#billing').find('[value="' + cart.billing.method + '"]').click();
    }
  }

  //console.log(cart.billing)

  // Atualiza visualizacão de pagamento
  jQuery('.billing-cost').html(formatCurrency(cart.billing.total));

  // Marca o passo de pagamento como concluido caso tudo tenha sido preenchido
  jQuery('.billing-step .fa-check').hide();
  if(check) { jQuery('.billing-step .fa-check').show(); }

  return check;

}

// Apos o carregamento da pagina
window.addEventListener('load', function(){

  // Monitora clique no botão de cada passo do checkout
  jQuery('.cart-step > button').click(function(){
    var c = jQuery(this).next('div');
    jQuery('.cart-step > button').next('div').not(c).slideUp();
    c.slideToggle();
  });
  jQuery('.shipping-step > button').click(function(){
    if(hasShipping()) {
      var c = jQuery(this).next('div');
      jQuery('.shipping-step > button').next('div').not(c).slideUp();
      c.slideToggle();
    }
  });
  jQuery('.billing-step > button').click(function(){
    var c = jQuery(this).next('div');
    jQuery('.billing-step > button').next('div').not(c).slideUp();
    c.slideToggle();
  });

  // Carrega meios de pagamento
  jQuery.getJSON('/json/billing.json?v=' + (new Date).getTime(), function(billing_methods){
    // Inicializa template de produto
    var template = '';

    // Caminha pelos produtos encontrados
    for(i in billing_methods) {
      template += '<div class="billing-method col-md-4">\
                          <h4><label class="selectable"><input type="radio" name="method" value="' + i + '" /><div><span class="fa fa-check-square"></span> ' + i + '</div></label></h4>\
                          <div class="billing-description">' + billing_methods[i].description + '</div>\
                        </div>';
    }

    // Inserer produtos na página
    jQuery('.billing-methods').html(template);

  });
  // Carrega produtos de arquivo remoto
  jQuery.getJSON('/json/products.json?v=' + (new Date).getTime(), function(response){
    // Inicializa template de produto
    var template = '';

    var products = response.data;

    // Caminha pelos produtos encontrados
    for(i in products) {
      var product = products[i];
      var gallery = '<div class="gallery">';
      var attributes = '';

      // Gera galeria de imagens
      for(a in product.gallery) {
        gallery += '<a data-caption="' + product.gallery[a].title + '" data-fancybox="gallery' + product.id + '" href="' + product.gallery[a].src + '">\
          <img alt="' + product.gallery[a].title + '" src="' + product.gallery[a].src + '" />\
        </a>';
      }
      gallery += '</div>';

      // Gera opções de configuração
      for(attr in product.attributes) {
        attributes += '<div class="select">\
          <strong>' + attr + '</strong>\
          <div class="options">';
        for(opt in product.attributes[attr].options) {
             attributes += '<label class="selectable"><input data-price="' + product.attributes[attr].options[opt].value + '" type="radio" name="' + attr + '" value="' + opt + '" /><div><span class="fa fa-check-square"></span> ' + opt + '</div><!--img src="http://via.placeholder.com/32x32" /--></label>';
        }
        attributes += '</div>';
        if(product.attributes[attr].allow_comments) {
          attributes += '<textarea class="attr-comment ' + attr + '-comment" name="' + attr + '_comment"></textarea>';
        }
        attributes += '</div>';
      }

      // Cria produto
      template += '<div class="col-12 col-sm-6 col-md-4 col-lg-3">\
          <div id="product' + product.id + '" class="product">\
            <form method="post">\
              <input type="hidden" value="' + product.id + '" name="id" />\
              <div class="images">\
                <div class="main-image">\
                  <input type="hidden" value="' + product.image + '" name="image" />\
                   <a data-caption="' + product.description + '" href="' + product.image + '" data-fancybox="gallery' + product.id + '">\
                    <img src="' + product.image + '" />\
                   </a>\
                  ' + gallery + '\
                </div>\
              </div>\
              <div class="product-name">\
                <input type="hidden" value="' + product.name + '" name="name" />\
                <h3>' + product.name + '</h3>\
              </div>\
              <div class="product-sku">\
                <input type="hidden" value="' + product.sku + '" name="sku" />\
                ' + (product.sku ? 'Cód.:' + product.sku : '') + '\
              </div>\
              <div class="product-sku">\
              </div>\
              <div class="prices">\
                <div class="old-price">\
                  <input type="hidden" value="' + product.old_price + '" name="original_old_price" />\
                  <input type="hidden" value="' + product.old_price + '" name="old_price" />\
                  ' + (product.old_price ? '<small>De <strike>' + formatCurrency(product.old_price) + '</strike></small>' : '') + '\
                </div>\
                <div class="current-price">\
                  <input type="hidden" value="' + product.price + '" name="original_price" />\
                  <input type="hidden" value="' + product.price + '" name="price" />\
                  Por <strong>' + (product.price ? formatCurrency(product.price) : '<small>Selecione as opções</small>') + '</strong>\
                </div>\
                <!--div class="promo-time">\
                  <span>Oferta termina em:</span> 2 dias 4h 45m 36s<br/>\
                </div-->\
              </div>\
              <hr/>\
              <dv class="product-options">\
              ' + attributes + '\
              </dv>\
              <hr/>\
              <button type="button" class="add-to-cart">Adicionar ao carrinho <div class="cart-qty cart-qty-' + product.id + '">0</div></button>\
            </form>\
          </div>\
        </div>';
      }

      // Inserer produtos na página
      jQuery('.products').html(template);

  });

  // Monitora clique no menu do topo
  jQuery('.btn-menu').click(function(){
    // Abre/Fecha menu
    jQuery('header ul').slideToggle();
  });

  // Monitora clique no botão de adicionar ao carrinho
  jQuery(document).on('click', '.add-to-cart', addToCart);

  /**
   * Atualiza marcação de quantidade de produtos no carrinho com a configuracão selecionada
   * @param  {[type]} ){                 var product [description]
   * @return {[type]}     [description]
   */
  jQuery(document).on('change', '.product [type="radio"]', function(){
    // Captura o produto
    var product = jQuery(this).parents('.product');
    // Pega o ID
    var id = product.find('[name="id"]').val();
    // Inicializa o carrinho
    var cart = JSON.parse(sessionStorage.cart);
    // Cria a chave
    var key = id;
    var original_old_price = Number(product.find('[name="original_old_price"]').val());
    var original_price = Number(product.find('[name="original_price"]').val());
    var attrs_prices = {price: original_price, old_price: original_old_price};
    product.find('form input[type="radio"]:checked').each(function(k, item){
      var price = jQuery(item).data('price');
      key += jQuery(item).val();
      attrs_prices.old_price += Number(price);
      attrs_prices.price += Number(price);
    });
    product.find('.old-price strike').html(formatCurrency(attrs_prices.old_price))
    product.find('.current-price strong').html(formatCurrency(attrs_prices.price))
    product.find('[name="old_price"]').val(attrs_prices.old_price)
    product.find('[name="price"]').val(attrs_prices.price)
    // Verifica se o produto existe no carrinho
    if(cart.items[key]) {
      // Se existir mostra a quantidade
      jQuery('.cart-qty-' + id).html(cart.items[key].quantidade)
    } else {
      // Se não mostra 0
      jQuery('.cart-qty-' + id).html(0)
    }
  });

  // Finalizar compra
  jQuery(document).on('click', '.checkout-button', function(){
    // Envia dados do carrinho a um servidor remoto
    jQuery.post('http://singlepagestore.com/save.php', {cart: sessionStorage.getItem('cart')}, function(response){
      jQuery.fancybox.open(response);
    })
  });

  // Clique no "Salvar" no formulario de entrega
  jQuery('#shipping form button').click(function(){
    updateShippingData();
    setTimeout(function(){ 
      jQuery('.shipping-step > button').click(); 
      checkShippingData(); 
      checkCartData(); 
      setTimeout(function(){
        jQuery('.checkout-button').hide();
        if(checkCartData() && checkShippingData() && checkBillingData()) {
          jQuery('.checkout-button').show();
        }
      }, 10)
    }, 10);
  });

  // Define method de pagamento no evento focus do input do cartao
  jQuery(document).on('focus', '.billing-methods input[type="text"]', function(){
    jQuery(this).parents('.billing-method').find('.selectable').click();
  });

  // Monitora salvamento do form de pagamento
  jQuery('#billing form button').click(function(){
    updateBillingData();
    setTimeout(function(){ 
      jQuery('.billing-step > button').click(); 
      checkBillingData(); 
      checkCartData(); 
      setTimeout(function(){
        jQuery('.checkout-button').hide();
        if(checkCartData() && checkShippingData() && checkBillingData()) {
          jQuery('.checkout-button').show();
        }
      }, 10)
    }, 10);
  });

  jQuery(document).on('mouseup', 'input[type="radio"]', function(){
    console.log($(this).prop('checked'))
    if($(this).prop('checked')) {
      $(this).prop('checked', false);
    }
  }).mouseup(function(){
    console.log($(this).prop('checked'))
    if($(this).prop('checked')) {
      $(this).prop('checked', false);
    }
  });
  // Expande/recolhe campos do form de frete
  jQuery('.shipping-container h3').click(function(){
    if(hasShipping()) {
      var c = jQuery(this).next('div');
      jQuery('.shipping-container h3').next('div').not(c).slideUp();
      c.slideToggle();
    }
  });

  // Expande/recolhe campos do form de pagamento
  jQuery('.billing-container h3').click(function(){
    var c = jQuery(this).next('div');
    jQuery('.billing-container h3').next('div').not(c).slideUp();
    c.slideToggle();
  });
  
  // Monitora clique no link de remover produto do carrinho
  jQuery(document).on('click', '.remove-item', function(){
    // Captura a chave do produto no carrinho
    var key = jQuery(this).data('key');
    // Inicializa objeto do carrinho
    var cart = JSON.parse(sessionStorage.cart);

    // Verifica se produto existe no carrinho
    if(cart.items[key]) {
      if(cart.items[key].quantidade) {
        // Se existir e quantidade for maior que 0 decrementa a quantidade
        cart.items[key].quantidade-=1;
      } else {
        // Senão delete ele do carrinho
        delete cart.items[key];
      }
    }

    // Atualiza dados do carrinho
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Atualiza visualições de frete e cobrança
    setTimeout(function(){ 
    updateBillingData();
      checkBillingData(); 
      checkCartData(); 
      setTimeout(function(){
        jQuery('.checkout-button').hide();
        if(checkCartData() && checkShippingData() && checkBillingData()) {
          jQuery('.checkout-button').show();
        }
      }, 10)
    }, 10);
  });

  // Confere todos dados ao carregar a pagina
  checkAllData()
});

// Confere todos os dados do carrinho
function checkAllData() {
  checkShippingData();
  updateShippingData();
  checkBillingData();
  updateBillingData();
  checkCartData();

  // Mostra ou oculta botão de checkout
  jQuery('.checkout-button').hide();
  if(checkCartData() && checkShippingData() && checkBillingData()) {
    jQuery('.checkout-button').show();
  }
}
