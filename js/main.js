//заглушки (имитация базы данных)
const image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6_Qns1QtDgceFCyvRs1JNSiJR2fHCRm1GuW2guPW8eUW66nIhmw';
const cartImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6_Qns1QtDgceFCyvRs1JNSiJR2fHCRm1GuW2guPW8eUW66nIhmw';

const items = ['Notebook', 'Display', 'Keyboard', 'Mouse', 'Phones', 'Router', 'USB-camera', 'Gamepad'];
const prices = [1000, 200, 20, 10, 25, 30, 18, 24];
const ids = [1, 2, 3, 4, 5, 6, 7, 8];

function fetchData(img) {
	let arr = [];
	for (let i = 0; i < items.length; i++) {
		arr.push({
			title: items[i],
			price: prices[i],
			id: ids[i],
			img: img,
		});
	}
	return arr
}

//общий класс списка
class List {
	constructor(container) {
		this.container = container
		this.goods = []
		this.allProducts = []
		this._init()
		this._render()
	}
	_init() {} //переопределим в подклассе

	_fetchList(data) {} //переопределим в подклассе

	_render() {  //построение и обновление списка каталога и корзины
		const block = document.querySelector(this.container)
		if (block.classList.contains('cart-block')) block.innerHTML = ""
		for (let product of this.goods) {
			const prod = new lists[this.constructor.name][0](product)
			block.insertAdjacentHTML('beforeend', prod.render())
		}
		for (let product of this.allProducts) {
			const prod = new lists[this.constructor.name][0](product)
			block.insertAdjacentHTML('beforeend', prod.render())
		}

	}
}

//подклассы списка товаров и списка корзины
class ProductsList extends List {
	constructor(container = '.products') {
		super(container)
	}
	_init() {
		this._fetchList(fetchData(lists[this.constructor.name][1]))
	}
	_fetchList(data) {  //заполнение каталога товаров
		this.goods = [...data]
	}
}

class Cart extends List {
	constructor(container = '.cart-block') {
		super(container)
		this.totalSum
	}
	//общий метод обновления списка корзины
	renderCartList(product) {
		let productId = +product.dataset['id'];
		let find = this.allProducts.find(element => element.id === productId)
		if (product.classList.contains('buy-btn')) this.addItem(product, find, productId)
		if (product.classList.contains('del-btn')) this.removeItem(product, find, productId)
		if (product.classList.contains('btn-cart')) document.querySelector(this.container).classList.toggle('invisible')
		super._render()
		if (!this.allProducts.length) {
			document.querySelector(this.container).textContent = 'Cart is empty!';
		}
		this.totalCost()

	}
	//метод добавления товара в корзину
	addItem(product, find, productId) {
		if (!find) {
			this.allProducts.push({
				title: product.dataset['name'],
				id: productId,
				img: cartImage,
				price: +product.dataset['price'],
				quantity: 1
			})
		} else find.quantity++
	}
	//метод удаления товара из корзины
	removeItem(product, find, productId) {
		if (find.quantity > 1) {
			find.quantity--
		} else {
			this.allProducts.splice(this.allProducts.indexOf(find), 1);
			document.querySelector(`.cart-item[data-id="${productId}"]`).remove()
		}
	}
	//метод подсчета общей стоимости корзины
	totalCost() {
		this.totalSum = 0;
		for (let product of this.allProducts) this.totalSum += product.price * product.quantity
		document.querySelector(this.container).insertAdjacentHTML('beforeEnd', `<div class='cart__total-cost'>Total cost of cart: ${this.totalSum} $</div>`)
	}
}


//общий класс карточки товара
class Item {
	constructor(elem) {
		this.product_name = elem.title
		this.product_price = elem.price
		this.product_id = elem.id
		this.product_img = elem.img
		this.product_quantity = elem.quantity
	}
	render() {}  //переопределим в подклассах
}

//подклассы карточек товара каталога и корзины со своими рендерами
class ProductItem extends Item {
	render() {
		return `<div class="product-item" data-id="${this.product_id}">
                        <img src="${this.product_img}" alt="Some img" width="200" height="150">
                        <div class="desc">
                            <h3>${this.product_name}</h3>
                            <p>${this.product_price} $</p>
                            <button class="buy-btn"
                            data-name="${this.product_name}"
                            data-image="${this.product_img}"
							data-id="${this.product_id}"
                            data-price="${this.product_price}">Купить</button>
                        </div>
                    </div>`
	}
}

class CartItem extends Item {
	render() {
		return `<div class="cart-item" data-id="${this.product_id}">
                            <div class="product-bio">
                                <img src="${this.product_img}" alt="Some image">
                                <div class="product-desc">
                                    <p class="product-title">${this.product_name}</p>
                                    <p class="product-quantity">Quantity: ${this.product_quantity}</p>
                                    <p class="product-single-price">$${this.product_price} each</p>
                                </div>
                            </div>
                            <div class="right-block">
                                <p class="product-price">${this.product_quantity * this.product_price}</p>
                                <button class="del-btn" data-id="${this.product_id}">&times;</button>
                            </div>
                        </div>`
	}
}

//словарь
let lists = {
	ProductsList: [ProductItem, image],
	Cart: [CartItem, cartImage]
}
//слушатели на кнопки
let evLists = ['.products', '.cart-block', '.btn-cart']
document.querySelectorAll(evLists).forEach( function(item) {
	item.addEventListener('click', (evt) =>
	cartList.renderCartList(evt.target))
})

// инициализация списка товаров и списка корзины
let prodList = new ProductsList()
let cartList = new Cart()
