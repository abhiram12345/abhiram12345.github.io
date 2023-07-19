import {onNavigate, navigate} from './functions.js';
if (!window.indexedDB) {
	console.log('indexedDB not supported!');
}
let db;
const dbConnection = window.indexedDB.open('shelfo_db', 14);
dbConnection.onupgradeneeded = event =>{
	const db = event.target.result;
	if (!db.objectStoreNames.contains('categories')) {
		const categories = db.createObjectStore('categories', {keyPath:'categoryId', autoIncrement:true});
		categories.createIndex('name', 'name', {unique:true});
		const uncategorized = {name:'Uncategorized'};
	    categories.put(uncategorized);
	}
	if (!db.objectStoreNames.contains('items')) {
        const items = db.createObjectStore('items', {keyPath:'itemId', autoIncrement:true});
		items.createIndex('name', 'name', {unique:false});
	    items.createIndex('categoryId', 'categoryId', {unique:false});
	}
	if (!db.objectStoreNames.contains('newOrder')) {
        db.createObjectStore('newOrder', {keyPath:'itemId', autoIncrement:true});
	}
	if (!db.objectStoreNames.contains('customProperties')) {
        db.createObjectStore('customProperties', {keyPath:'id', autoIncrement:true});
	}
}
dbConnection.onsuccess = event =>{
	db = event.target.result;
}
//declarations
const menuIcon = document.querySelector('#menu-icon');
const menu = document.querySelector('#menu-container');
const rootDiv = document.getElementById('root');
const searchDiv = document.getElementById('search-view');
const menuLinks = document.querySelectorAll('#menu span');
//template objs
class Page {
	constructor(view) {
		this.view = view;
	}
	clean() {
		const view = this.view;
		while (view.hasChildNodes()) {
				view.removeChild(view.firstChild);
		}
	}
	cleanElm(elm){
		while (elm.hasChildNodes()) {
				elm.removeChild(elm.firstChild);
		}
	}
	smartCase(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	notify(message, buttonText, callback) {
		const note = document.createElement('foot-notification');
		note.setAttribute('data-message', message);
		if (buttonText && callback) {
			const elem = note.shadowRoot.querySelector('span');
			elem.querySelector('b').innerText = buttonText;
			elem.style.display = 'block';
			elem.addEventListener('click', callback);
		}
		this.view.appendChild(note);
	}
	setActivePage() {
        const menu = document.querySelector('side-bar');
		const active = menu.shadowRoot.querySelector('.current');
		if (active) {
			active.classList.remove('current')
		};
		const current = menu.shadowRoot.querySelector(`[data-link='${location.pathname}']`);
        current.classList.add('current');
	}
}
//search
const searchShelf = new Page(rootDiv);
searchShelf.render = function() {
	this.clean();
	const input = document.querySelector('#search-shelf input');
	if (window.location.pathname == '/search') {
		history.replaceState({}, ' ', `search?q=${input.value}`);
	}else {
		history.pushState({}, ' ', `search?q=${input.value}`);
	}
	const transaction = db.transaction(['items', 'categories'], 'readonly');
	const itemsStore = transaction.objectStore('items');
	const categoryStore = transaction.objectStore('categories');
	const request = itemsStore.openCursor();
	request.onsuccess = (e) =>{
		const cursor = e.target.result;
		if (cursor) {
			const i = cursor.value;
			if (cursor.value.name.toLowerCase().includes(input.value.toLowerCase())) {
				const item = document.createElement('item-block');
				const categoryQuery = categoryStore.get(cursor.value.categoryId);
				categoryQuery.onsuccess = e =>{
					const catName = e.target.result.name;
					item.setAttribute('data-category-name', catName);
					item.setAttribute('data-item-name', i.name);
					item.setAttribute('data-price', i.price);
					item.setAttribute('data-stock', i.stockCount);
					item.showProperties(...i.customProperties);
					item.setAttribute('data-link', `/item-view?id=${i.itemId}`);
					item.addEventListener('click', onNavigate);
					rootDiv.appendChild(item);
				}
			}
			cursor.continue();
		}
	}
}
//items
const itemsPage = new Page(rootDiv);
itemsPage.render = function(e) {
	this.clean();
	this.setActivePage();
	this.view.appendChild(document.createElement('header-bar'));
	let currentKey;
	let observer;
	const loadMore = (entries, observer) =>{
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				loadItems(IDBKeyRange.upperBound(currentKey), true);
			}
		});
	}
	const options = {
		root:null,
		rootMargin:'0px',
		threshold:1.0
	};
	observer = new IntersectionObserver(loadMore, options);
	const loadItems = (key) =>{
		let loaded = 0;
		const transaction= db.transaction(['items', 'categories', 'customProperties'], 'readonly');
		const itemsStore = transaction.objectStore('items');
		const categoryStore = transaction.objectStore('categories');
		itemsStore.openCursor(key, 'prev').onsuccess = event =>{
			const cursor = event.target.result;
			if (cursor) {
				const i = cursor.value;
				const item = document.createElement('item-block');
				const categoryQuery = categoryStore.get(i.categoryId);
				categoryQuery.onsuccess = e =>{
					const catName = e.target.result.name;
					const customProperties = i.customProperties;
					item.setAttribute('data-category-name', catName);
					item.setAttribute('data-item-name', i.name);
					item.setAttribute('data-price', i.price);
					item.setAttribute('data-stock', i.stockCount);
					item.setAttribute('data-link', `/item-view?id=${i.itemId}`);
					item.addEventListener('click', onNavigate);
					loaded++;
					const myPromise = new Promise((myResolve)=>{
						const newArray = [];
						for (let p =0; p<customProperties.length; p++){
							const id = parseInt(customProperties[p].propertyId);
							const getCps = transaction.objectStore('customProperties').get(id);
							getCps.onsuccess = (e) =>{
								const cp = e.target.result;
								const obj = {};
								obj.name = cp.name;
								obj.value = customProperties[p].value;
								newArray.push(obj);
								if (p==customProperties.length-1){
									myResolve(newArray);
								}
							}
						}
					});
					myPromise.then((newArray)=>{
                        item.showProperties(...newArray);
						this.view.appendChild(item);
						if (loaded <= 15) {
							cursor.continue();
						}else {
							currentKey = i.itemId;
							const itemBlocks = document.getElementsByTagName('ITEM-BLOCK');
							observer.observe(itemBlocks[itemBlocks.length-6]);
						}
					});
				}
			}
		}
	};
	loadItems(null);
	const bttn = document.createElement('add-button');
	bttn.setAttribute('data-link', '/add-item');
	bttn.addEventListener('click', onNavigate);
	this.view.appendChild(bttn);
};
//itemview
const itemView = new Page(rootDiv);
itemView.render = function() {
	this.clean();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'Item');
	this.view.appendChild(header);
	const params = new URLSearchParams(window.location.search);
	const itemId = parseInt(params.get('id'));
	const transaction = db.transaction(['items', 'categories', 'customProperties'], 'readonly');
	const itemsStore = transaction.objectStore('items');
	const itemQuery = itemsStore.get(itemId);
	itemQuery.onsuccess = (e) =>{
		const item = e.target.result;
		const categoryId = item.categoryId;
		const categoryQuery = transaction.objectStore('categories').get(categoryId);
		categoryQuery.onsuccess = (e) =>{
			const category = e.target.result.name;
			//body
			const $element = document.createElement('item-view');
			const $increaseBttn = document.createElement('rounded-button-2');
			//build
			$element.setAttribute('data-item-name', item.name);
			$element.setAttribute('data-price', item.price);
			$element.setAttribute('data-stock', item.stockCount);
			$element.setAttribute('data-category', category);
			$element.editButton.addEventListener('click', ()=>{
				navigate(`/edit-item?id=${item.itemId}`);
		    });
			const myPromise = new Promise((myResolve)=>{
				const newArray = [];
				const customProperties = item.customProperties;
				for (let p =0; p<customProperties.length; p++){
					const id = parseInt(customProperties[p].propertyId);
					const getCps = transaction.objectStore('customProperties').get(id);
					getCps.onsuccess = (e) =>{
						const cp = e.target.result;
						const obj = {};
						obj.name = cp.name;
						obj.value = customProperties[p].value;
						newArray.push(obj);
						if (p===customProperties.length-1){
							myResolve(newArray);
						}
					}
				}
			});
			myPromise.then((newArray)=>{
				$element.showProperties(...newArray);
			});
			$increaseBttn.setAttribute('data-text', 'Stock +');
			//append
			this.view.appendChild($element);
			this.view.appendChild($increaseBttn);
		}
	}
}
//edit item
const editItem = new Page(rootDiv);
editItem.render = function() {
	this.clean();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'Edit Item');
	this.view.appendChild(header);
	const params = new URLSearchParams(window.location.search);
	const itemId = parseInt(params.get('id'));
	const transaction = db.transaction(['items', 'categories'], 'readwrite');
	const itemsStore = transaction.objectStore('items');
	const itemQuery = itemsStore.get(itemId);
	itemQuery.onsuccess = e =>{
		const item = e.target.result;
		const itemName = item.name;
		const fragment = document.createDocumentFragment();
		const nameInput = document.createElement('add-data');
		const priceInput = document.createElement('add-data');
		const stockInput = document.createElement('add-number');
		const showPropBttn = document.createElement('submit-data');
		const container = document.createElement('div');
		const submitBttn = document.createElement('submit-data');
		const deleteBttn = document.createElement('submit-data');
		const customProperties = item.customProperties;
		nameInput.setAttribute('data-label', 'Item name');
		nameInput.value = item.name;
		priceInput.setAttribute('data-label', 'Price');
		priceInput.value = item.price;
		stockInput.setAttribute('data-label', 'Stock');
		stockInput.value = item.stockCount;
		container.style.display = 'none';
		deleteBttn.setAttribute('data-label', 'Delete');
		deleteBttn.setAttribute('data-color', 'darkred');
		showPropBttn.setAttribute('color', '#303030');
		showPropBttn.setAttribute('data-label', 'Show custom properties');
		showPropBttn.addEventListener('click', (e) =>{
			if (container.style.display == 'none') {
				container.style.display = 'block';
				e.currentTarget.setAttribute('data-label', 'Hide custom properties');
			}else {
				container.style.display = 'none';
				e.currentTarget.setAttribute('data-label', 'Show custom properties');
			}
		});
		if (customProperties.length > 0) {
			customProperties.forEach(c =>{
				let input;
				if (c.dataType == 'number' || c.dataType =='float') {
					input = document.createElement('add-number');
					if (c.dataType == 'float') {
						input.setAttribute('step', '0.0001');
					}
				}else {
					input = document.createElement('add-data');
					input.setAttribute('pattern', '[a-zA-Z0-9]( ?[a-zA-Z0-9])*');
				}
				db.transaction('customProperties').objectStore('customProperties').get(c.propertyId).onsuccess = (e) =>{
                    input.setAttribute('data-label', this.smartCase(e.target.result.name));
				};
				input.setAttribute('data-type', c.dataType);
				input.className = 'custom-property';
				input.value = c.value;
				container.appendChild(input);
			});
		}else {
			container.style.textAlign = 'center';
			container.innerText = 'No custom properties';
		}
		submitBttn.addEventListener('click', ()=>{
			let exist;
			const transaction = db.transaction(['categories', 'items'], 'readonly');
			const itemsStore = transaction.objectStore('items');
			const categoryStore = transaction.objectStore('categories');
			const customProps = container.querySelectorAll('.custom-property');
			item.name = nameInput.value;
			item.price = priceInput.value;
			item.stockCount = stockInput.value;
			item.customProperties = [];
			for (prop of customProps) {
				const obj = {};
				obj.name = prop.getAttribute('data-label');
				obj.dataType = prop.getAttribute('data-type');
				obj.value = prop.value;
				item.customProperties.push(obj);
			}
			const request = itemsStore.openCursor();
			request.onsuccess = (e) =>{
				const cursor = e.target.result;
				if (cursor) {
					if (cursor.value.name.toLowerCase() == nameInput.value.toLowerCase() && cursor.value.categoryId == item.categoryId) {
						exist = true;
						return exist;
					}else {
						cursor.continue();
					}
				}
			}
			transaction.oncomplete = () =>{
				const itemsStore = db.transaction('items', 'readwrite').objectStore('items');
				if (itemName == nameInput.value) {
					alert(itemName);
					const putRequest = itemsStore.put(item);
					putRequest.onsuccess = () =>{
						navigate(`/item-view?id=${itemId}`);
					}
				}else if (exist != true) {
					alert(2);
					const putRequest = itemsStore.put(item);
					putRequest.onsuccess = () =>{
						navigate(`/item-view?id=${itemId}`);
					}
				}else {
					alert(3);
					nameInput.shadowRoot.querySelector('p').innerText = 'Item name already exists';
				}
			}
		});
		deleteBttn.addEventListener('click', () =>{
			if (confirm('The item will be permanently deleted.')) {
				const transaction = db.transaction('items', 'readwrite');
				const itemsStore = transaction.objectStore('items');
				const deleteItem = itemsStore.delete(item.itemId);
				deleteItem.onsuccess = () =>{
					navigate('/');
					const undoDeletion = () =>{
						const transaction = db.transaction('items', 'readwrite');
						const store = transaction.objectStore('items');
						const restore = store.put(item);
						restore.onsuccess = () =>{
							navigate('/');
							this.notify('Item restored', 'View', ()=>{
								navigate(`/item-view?id=${item.itemId}`);
							});
						}
					}
					this.notify(`${itemName} deleted successfully`, 'Undo', undoDeletion);
				}
			}
		});
		fragment.append(nameInput, priceInput, stockInput, showPropBttn, container, submitBttn, deleteBttn);
		this.view.appendChild(fragment);
	}
}
//out of stock
const outofStock = new Page(rootDiv);
outofStock.render = function() {
	this.clean();
	this.setActivePage();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'Out of stock');
	this.view.appendChild(header);
	const transaction = db.transaction(['items', 'categories']);
	const itemStore = transaction.objectStore('items');
	let isStarted;
	const cursorRequest = itemStore.openCursor();
	cursorRequest.onsuccess = e =>{
		const cursor = e.target.result;
		if (cursor){
			if (!isStarted) {
                isStarted = true;
			}
           if (cursor.value.stockCount == 0){
			  const getCategory = transaction.objectStore('categories').get(cursor.value.categoryId);
			  getCategory.onsuccess = e =>{
				const item = document.createElement('item-simple');
				item.dataset.title = cursor.value.name;
				item.setAttribute('data-sub-title', e.target.result.name);
				this.view.appendChild(item);
			  }
		   }
		   cursor.continue();
		   if (!isStarted) {
			    alert(isStarted);
				const el = document.createElement('empty-message');
				el.setAttribute('icon', 'sentiment_satisfied');
				el.setAttribute('message', 'No items Yet!');
				this.view.appendChild(el);
			}
		}
	}
};
//new order
const newOrder = new Page(rootDiv);
newOrder.render = function() {
	this.clean();
	this.setActivePage();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'New order');
	this.view.appendChild(header);
	const container = document.createElement('div');
	const head = document.createElement('div');
	head.classList.add('container-head');
	head.style.width = '300px';
	container.appendChild(head);
	const orderContainer = document.createElement('div');
	orderContainer.classList.add('order-container');
	const transaction = db.transaction('newOrder', 'readonly');
	const store = transaction.objectStore('newOrder');
	const countRequest = store.count();
	countRequest.onsuccess = (e) =>{
        const count = e.target.result;
		if (count == 0) {
			const el = document.createElement('empty-message');
			el.setAttribute('icon', 'sentiment_dissatisfied');
			el.setAttribute('message', 'No items Yet!');
			this.view.appendChild(el);
		}else {
			bttnContainer.style.display = 'flex';
			container.classList.add('order-container');
			store.openCursor().onsuccess = (e)=>{
                const cursor = e.target.result;
				if (cursor) {
                   const item = document.createElement('div');
                   item.classList.add('order-item');
				   item.innerText = cursor.value.itemName;
				   item.setAttribute('data-id', cursor.value.itemId);
				   orderContainer.appendChild(item);
				   cursor.continue();
				}
			}
			transaction.oncomplete = () =>{
                container.appendChild(orderContainer);
			}
		}
	}
    const addButton = document.createElement('add-button');
	addButton.addEventListener('click', ()=>{
		const modalBox = document.createElement('modal-box');
		const addData = document.createElement('add-data');
		addData.setAttribute('data-label', 'Item name');
		const bttn = document.createElement('submit-data');
		bttn.setAttribute('data-label', 'Add');
		addData.onEnter(()=>{
			bttn.click();
		});
		modalBox.addContent(addData);
		modalBox.addContent(bttn);
		bttn.addEventListener('click', ()=>{
			const data = {};
			data.itemName = addData.value;
			const putData = db.transaction('newOrder', 'readwrite').objectStore('newOrder').put(data);
            putData.onsuccess = () =>{
				navigate('/new-order', true);
			}
		})
		this.view.appendChild(modalBox);
	});
    const bttnContainer = document.createElement('div');
	bttnContainer.classList.add('right-float-button-container');
	bttnContainer.style.display = 'none';
	const editButton = document.createElement('div');
	editButton.classList.add('right-float-button');
	const shareButton = document.createElement('div');
	shareButton.classList.add('right-float-button');
	const copyButton = document.createElement('div');
	copyButton.classList.add('right-float-button');
	const buttons = [editButton, shareButton, copyButton];
	const iconNames = ['delete', 'share', 'content_copy'];
	for (let i=0; i < buttons.length; i++) {
        const span = document.createElement('span');
		span.className = 'material-symbols-rounded';
		span.innerText = iconNames[i];
		buttons[i].appendChild(span);
	}
	editButton.addEventListener('click', ()=>{
		bttnContainer.style.display = 'none';
		const items = orderContainer.querySelectorAll('.order-item');
		for (let item of items) {
			const checkBox = document.createElement('input');
			checkBox.setAttribute('type', 'checkbox');
			checkBox.addEventListener('change', ()=>{
				if(container.querySelectorAll('input:checked').length >0){
					deleteBttn.shadowRoot.querySelector('button').disabled = false;
				}else {
					deleteBttn.shadowRoot.querySelector('button').disabled = true;
				}
			})
			const span = document.createElement('span');
			span.classList.add('order-selectable');
			item.append(checkBox, span);
			item.addEventListener('click', ()=>{
				item.querySelector('input').click();
			});
		}
        const selectAllContainer = document.createElement('div');
		selectAllContainer.classList.add('container-flex-row');
		selectAllContainer.style.justifyContent = 'flex-start';
		const selectBox = document.createElement('input');
		selectBox.setAttribute('type', 'checkbox');
		selectBox.addEventListener('change', ()=>{
			const items = orderContainer.querySelectorAll('input');
			if (selectBox.checked) {
				for (let item of items) {
					item.checked = true;
				}
			}else{
				for (let item of items) {
					item.checked = false;
				}
			}
		});
		const selectAllText = document.createElement('span');
		selectAllText.innerText = 'Select all'
		selectAllContainer.append(selectBox, selectAllText);
		head.appendChild(selectAllContainer);
		head.style.height= '50px';
		const deleteBttn = document.createElement('add-button');
		deleteBttn.setAttribute('text', 'Delete');
		deleteBttn.addEventListener('click', ()=>{
			if (confirm('Are you sure?')) {
				const transaction = db.transaction('newOrder', 'readwrite');
				const store = transaction.objectStore('newOrder');
				const items = orderContainer.querySelectorAll('input:checked');
				for (let item of items) {
					const dataId = parseInt(item.parentElement.dataset.id);
					store.delete(dataId);
				}
				transaction.oncomplete = () =>{
					navigate('/new-order', true);
				}
			}
		});
		deleteBttn.shadowRoot.querySelector('button').disabled = true;
		addButton.replaceWith(deleteBttn);
		const cancelBttn = document.createElement('div');
		cancelBttn.innerText = 'Cancel';
		cancelBttn.classList.add('button-fixed');
		cancelBttn.style.bottom = '70px';
		this.view.appendChild(cancelBttn);
	})
	bttnContainer.append(shareButton, copyButton, editButton);
	this.view.appendChild(container);
	this.view.appendChild(addButton);
	this.view.appendChild(bttnContainer);
};
//manage items
const manageItems = new Page(rootDiv);
manageItems.render = function () {
	this.clean();
	this.setActivePage();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'Manage items');
	this.view.appendChild(header);
	const el = document.createElement('grid-menu');
	const titles = ['Categories', 'Add Item', 'Similar Items', 'Delete Items', 'Insights'];
	const icons = ['category', 'add', 'workspaces', 'delete', 'insights'];
	const roots = ['/categories', '/add-item', '/categories', '/categories', '/categories'];
	for (let i=0; i<icons.length; i++) {
		const newElm = document.createElement('menu-block');
		newElm.setAttribute('slot', 'block');
		newElm.setAttribute('icon', icons[i]);
		newElm.setAttribute('title', titles[i]);
		newElm.setAttribute('data-link', roots[i]);
		newElm.addEventListener('click', onNavigate);
		el.appendChild(newElm);
	}
	this.view.appendChild(el);
	};
//category
const categories = new Page(rootDiv);
categories.render = function() {
	this.clean();
	(() =>{
		const transaction= db.transaction('categories', 'readonly');
		const store = transaction.objectStore('categories');
		store.getAll().onsuccess = event =>{
			const categories = event.target.result;
			if (categories.length < 1) {
				const el = document.createElement('empty-message');
				el.setAttribute('icon', 'potted_plant');
				el.setAttribute('message', 'No categories yet!');
				this.view.appendChild(el);
			}else {
				categories.forEach(c =>{
					const category = document.createElement('category-block');
					category.setAttribute('data-name', c.name);
					category.setAttribute('data-link', `/show-category?name=${c.name.replace(/\s/g, '+')}`);
					category.addEventListener('click', onNavigate);
					this.view.appendChild(category);
				});
			}
		}
	})();
	const bttn = document.createElement('add-button');
	bttn.setAttribute('padding', '15px');
	bttn.setAttribute('text', 'New category');
	bttn.setAttribute('data-link', '/create-category');
	bttn.addEventListener('click', onNavigate);
	this.view.appendChild(bttn);
};
//showCategory
const showCategory = new Page(rootDiv);
showCategory.render = function() {
	this.clean();
	const params = new URLSearchParams(window.location.search);
	const catName = params.get('name');
	const transaction= db.transaction(['categories', 'items'], 'readonly');
	const categoryStore = transaction.objectStore('categories');
	const itemsStore = transaction.objectStore('items');
	const selected = categoryStore.index('name');
	const query = selected.get(catName);
	query.onsuccess = e =>{
		const category = e.target.result;
		const categoryId = category.categoryId;
		alert(JSON.stringify(categoryId));
		const categoryDiv = document.createElement('category-view');
		const span = categoryDiv.shadowRoot.querySelector('span');
		categoryDiv.setAttribute('data-name', category.name);
		span.setAttribute('data-link', `/info-box?name=${category.name.replace(/\s/g, '+')}`);
		span.addEventListener('click', onNavigate);
		this.view.appendChild(categoryDiv);
		const index = itemsStore.index('categoryId');
		const itemsQuery = index.getAll(categoryId);
		itemsQuery.onsuccess = e =>{
			const items = e.target.result;
			if (items) {
			if (items.length < 1) {
				const el = document.createElement('empty-message');
				el.setAttribute('icon', 'potted_plant');
				el.setAttribute('message', 'No Item yet!');
				this.view.appendChild(el);
			}else {
				items.forEach(i =>{
					const item = document.createElement('item-block');
					item.setAttribute('data-item-name', i.name);
					item.setAttribute('data-price', i.price);
					item.setAttribute('data-stock', i.stockCount);
					item.showProperties(...i.customProperties);
					item.setAttribute('data-link', `/item-view?id=${i.itemId}`);
					item.addEventListener('click', onNavigate);
					this.view.appendChild(item);
					});
				}
		}
		}
	}
};
//category info
const categoryInfo = new Page(rootDiv);
categoryInfo.render = function() {
	this.clean();
	const params = new URLSearchParams(location.search);
	const catName = params.get('name');
	const infoBox = document.createElement('info-box');
	const editButton = infoBox.shadowRoot.querySelector('.edit');
	if (catName === 'Uncategorized') {
		infoBox.editable = false;
	}
	infoBox.setAttribute('data-name', catName);
	editButton.setAttribute('data-link', `/edit-category?name=${params.get('name').replace(/\s/g, '+')}`);
	editButton.addEventListener('click', onNavigate);
	this.view.appendChild(infoBox);
}
//edit category
const editCategory = new Page(rootDiv);
editCategory.render = function() {
	this.clean();
	const params = new URLSearchParams(location.search);
	const catName = params.get('name');
	const saveButton = document.createElement('submit-data');
	const deleteButton = document.createElement('submit-data');
	const transaction = db.transaction('categories', 'readonly');
	const store = transaction.objectStore('categories');
	const index = store.index('name');
	const query = index.get(catName);
	query.onsuccess = (e) =>{
		const category = e.target.result;
		const categoryInput = document.createElement('add-data');
		categoryInput.setAttribute('pattern', '[a-zA-Z]+( ?[a-zA-Z])*');
		categoryInput.required = true;
		const updateCategory = () =>{
			if (categoryInput.validity &&  catName !== 'Uncategorized') {
				const transaction= db.transaction('categories', 'readwrite');
				const store = transaction.objectStore('categories');
				const index = store.index('name');
				const query = index.get(catName);
				query.onsuccess = e =>{
					const category = e.target.result;
					category.name = categoryInput.value;
					store.put(category);
					navigate('/categories');
				}
			}
		}
		const deleteCategory = () =>{
			if (catName !== 'Uncategorized' && confirm(`This action will delete the category with all it's items`)) {
				const transaction = db.transaction(['categories', 'items'], 'readwrite');
				const catStore = transaction.objectStore('categories');
				const itemsStore = transaction.objectStore('items');
				const index = catStore.index('name');
				const query = index.get(catName);
				query.onsuccess = (e) =>{
					const backUp =[];
					const category = e.target.result;
					const categoryId = e.target.result.categoryId;
					const request = itemsStore.openCursor();
					request.onsuccess = e =>{
						const cursor = e.target.result;
						if (cursor) {
							if (cursor.value.categoryId == categoryId) {
								const deleteRequest = cursor.delete();
								deleteRequest.onsuccess = (e) =>{
									backUp.push(cursor.value);
								}
							}
							cursor.continue();
						}
						const deleteStore = catStore.delete(categoryId);
						transaction.oncomplete = () =>{
							navigate('/categories');
							this.notify('Item deleted successfully', 'Undo', ()=>{
								const transaction = db.transaction(['categories', 'items'], 'readwrite');
								const restoreCategory = transaction.objectStore('categories').put(category);
								backUp.forEach((i) =>{transaction.objectStore('items').put(i);});
								transaction.oncomplete = () =>{
									this.notify('Category and all items restored', 'View', ()=>{
										navigate(`/show-category?name=${category.name}`);
									});
								}
							});
						}
					}
				}
			}
		}
		saveButton.setAttribute('data-label', 'Save Changes');
		categoryInput.setAttribute('data-placeholder', category.name);
		categoryInput.setAttribute('data-label', 'Category name');
		deleteButton.setAttribute('data-label', 'Delete category');
		deleteButton.setAttribute('data-color', 'darkred');
		saveButton.addEventListener('click', updateCategory);
		this.view.appendChild(categoryInput);
		this.view.appendChild(saveButton);
		deleteButton.addEventListener('click', deleteCategory)
		this.view.appendChild(deleteButton);
	}
}
//create category
const createCategory = new Page(rootDiv);
createCategory.render = function() {
	this.clean();
	const customProperties = [];
	const el = document.createElement('add-data');
	el.setAttribute('data-label', 'Category');
	el.setAttribute('data-pattern', '[a-zA-Z0-9]+( ?[a-zA-Z0-9])*');
	el.setAttribute('data-placeholder', 'Eg : Smart Phones');
	el.required = true;
	const bttn = document.createElement('submit-data');
	bttn.setAttribute('data-link', '/categories'); 
	const div = document.createElement('div');
	const addProperty = document.createElement('add-property');
	this.view.appendChild(el);
	this.view.appendChild(div);
	this.view.appendChild(addProperty);
	this.view.appendChild(bttn);
	//data
	const newProperty = () =>{
		const nameInput = document.createElement('add-data');
		nameInput.setAttribute('data-label', 'Property Name');
		nameInput.setAttribute('data-placeholder', 'Eg : Color');
		nameInput.setAttribute('data-pattern', '[a-zA-Z0-9]+( ?[a-zA-Z0-9])*');
		const valueType = document.createElement('custom-select');
		valueType.setAttribute('data-label', 'Data type');
		valueType.addOptions('string', 'number', 'float');
		div.appendChild(nameInput);
		div.appendChild(valueType);
		addProperty.removeEventListener('click', newProperty);
		addProperty.addEventListener('click', setProperty);
	}
	function removeProp(){
		const checkProp = (prop) =>{
			if (prop.name === this.getAttribute('data-name')) {
				return prop;
			}
		}
		customProperties.splice(customProperties.findIndex(checkProp), 1);
		this.remove();
	}
	const setProperty = () =>{
		const propName = div.querySelector('add-data');
		const dataType = div.querySelector('custom-select');
		if (propName.value !== '' && propName.validity) {
			const prop = document.createElement('custom-property');
			prop.setAttribute('data-name', propName.value);
			prop.setAttribute('data-type', dataType.value);
			prop.shadowRoot.querySelector('span').addEventListener('click', removeProp.bind(prop));
			customProperties.push({name:propName.value, dataType:dataType.value});
			propName.value='';
			this.view.insertBefore(prop, div);
		}
	}
	const createObj = () =>{
		const name = div.querySelector('add-data');
		const dataType = div.querySelector('custom-select');
		if (name &&  dataType) {
			if (name.value !== '') {
				const obj = {};
				obj.name = name.value;
				obj.dataType = dataType.value;
				customProperties.push(obj);
			}
		}
	}
	const checkValidityAll = () =>{
		var elms = div.querySelectorAll('add-data');
		for (let elm of elms) {
				if (elm.validity === false) {
				return false;
				}
		}
		return true;
	}
	const addData = (e) =>{
		let exist;
		let target = e.target;
		const transaction = db.transaction('categories', 'readwrite');
		const objStore = transaction.objectStore('categories');
		const catName = el.value;
		const query = objStore.openCursor();
		query.onsuccess = (e) =>{
			const cursor = e.target.result;
			if (cursor) {
				if (cursor.value.name.toLowerCase() == catName.toLowerCase()) {
					el.shadowRoot.querySelector('p').innerText = 'Category already exists';
					exist = true;
					return exist;
				}else {
					cursor.continue();
				}
			}
			exist = false;
			return exist;
		}
		transaction.oncomplete = () =>{
			if (exist !==true && el.validity && checkValidityAll()) {
				const transaction = db.transaction(['categories', 'customProperties'], 'readwrite');
				const catStore = transaction.objectStore('categories');
				const cpStore = transaction.objectStore('customProperties');
				const value = el.value;
				const catObj = {name:value};
				const putData = catStore.put(catObj);
				putData.onsuccess = (e) =>{
					createObj();
					const categoryId = e.target.result;
					for (let p of customProperties){
                        p.categoryId = categoryId;
						cpStore.put(p);
					}
				}
				transaction.oncomplete = () =>{
					navigate(target.dataset.link);
				}
			}else {
				alert(el.validity);
				alert(checkValidityAll());
				alert(`exist:${exist}`);
			}
		}
	}
	bttn.addEventListener('click', addData);
	addProperty.addEventListener('click', newProperty);
};
//create_items
const addItem = new Page(rootDiv);
addItem.render = function() {
	this.clean();
	const header = document.createElement('header-bar-2');
	header.setAttribute('data-title', 'New Item');
	this.view.appendChild(header);
	let categories = [];
	const tabs = document.createElement('horizontal-tabs');
	const itemName = document.createElement('add-data');
	const categoryName = document.createElement('custom-select');
	const priceInput = document.createElement('add-number');
	const stockInput = document.createElement('add-number');
	const nextBttn = document.createElement('submit-data');
	const propertyBox = document.createElement('div');
	const customPropertyBox = document.createElement('div');
	const submitBttn = document.createElement('submit-data');
	const detailsFragment = document.createDocumentFragment();
	const customPropertiesFragment = document.createDocumentFragment()
	itemName.setAttribute('data-label', 'Item name');
	itemName.required = true;
	categoryName.setAttribute('data-label', 'Category');
	priceInput.setAttribute('data-label', 'Price');
	stockInput.setAttribute('data-label', 'Stock');
	nextBttn.setAttribute('data-label', 'Next');
	nextBttn.addEventListener('click', ()=>{
		tabs.nextTab();
	});
	const transaction= db.transaction('categories', 'readonly');
	const store = transaction.objectStore('categories');
	const checkValidityAll = () =>{
		const elems = document.querySelectorAll('add-data', 'add-number');
		for (let elem of elems) {
			if (elem.validity === false) {
				return false;
			}
		}
		return true;
	}
	const submitData = () =>{
		let exist;
		const transaction= db.transaction(['categories', 'items'], 'readonly');
		const categoryStore = transaction.objectStore('categories');
		const itemsStore = transaction.objectStore('items');
		const categoryIndex = categoryStore.index('name');
		const newItem = {};
		newItem.name = itemName.value;
		newItem.price = priceInput.value;
		newItem.stockCount = stockInput.value != '' ? parseInt(stockInput.value) : stockInput.value;
		newItem.customProperties = [];
		const customProperties = customPropertyBox.querySelectorAll('.custom-property');
		for (let property of customProperties) {
			const obj = {};
			obj.propertyId = parseInt(property.getAttribute('data-property-id'));
			obj.value =  (property.tagName == 'ADD-NUMBER' && property.value != '') ? parseInt(property.value) : property.value;
			newItem.customProperties.push(obj);
		}
		const request = categoryIndex.getKey(categoryName.value);
		request.onsuccess = e =>{
			const categoryId = e.target.result;
			newItem.categoryId = categoryId;
			const cursorRequest = itemsStore.openCursor();
			cursorRequest.onsuccess = e =>{
				const cursor = e.target.result;
				if (cursor) {
					if (cursor.value.name.toLowerCase() == itemName.value.toLowerCase() && cursor.value.categoryId == categoryId) {
						exist = true;
						itemName.shadowRoot.querySelector('p').innerText = 'Item already exists';
						return exist;
					}else {
						cursor.continue();
					}
				}
			}
			transaction.oncomplete = () =>{
				if (checkValidityAll() && exist !== true) {
					const newTransaction = db.transaction('items', 'readwrite');
					const itemsStore = newTransaction.objectStore('items');
					const putData = itemsStore.put(newItem);
						putData.onsuccess = e =>{
						navigate('/');
						this.notify('New item added');
					}
					putData.onerror = e =>{
						alert('error');
					}
				}
			}
		}
	}
	const readProperties = () =>{
			this.cleanElm(customPropertyBox);
			const transaction= db.transaction(['categories', 'customProperties'], 'readonly');
			const store = transaction.objectStore('categories');
			const selected = store.index('name');
			const query = selected.get(categoryName.value);
			query.onsuccess = (event) => {
				const categoryId = event.target.result.categoryId;
				const resultArray = [];
				const store = transaction.objectStore('customProperties');
				const cursorRequest = store.openCursor();
				cursorRequest.onsuccess = (e) =>{
                    const cursor = e.target.result;
					if(cursor) {
						if (cursor.value.categoryId == categoryId) {
							resultArray.push(cursor.value);
						}
						cursor.continue();
					}
				}
				transaction.oncomplete = () =>{
                    const fragment = document.createDocumentFragment();
					if (resultArray) {
						resultArray.forEach(a => {
							let input;
							const name = this.smartCase(a.name);
							const dataType = a.dataType;
							if (dataType === 'number' || dataType === 'float') {
								input = document.createElement('add-number');
								if (dataType === 'float') {
									input.setAttribute('step', '0.0001');
									input.setAttribute('data-type', 'float');
								}else {
									input.setAttribute('data-type', 'number');
								}
								input.setAttribute('class', 'custom-property');
							}else {
								input = document.createElement('add-data');
								input.setAttribute('data-type', 'string');
								input.setAttribute('pattern', '[a-zA-Z0-9]( ?[a-zA-Z0-9])*');
								input.setAttribute('class', 'custom-property');
							}
							input.setAttribute('data-label', name);
							input.setAttribute('data-property', a.name);
							input.setAttribute('data-property-id', a.id);
							input.setAttribute('data-placeholder', dataType);
							fragment.appendChild(input);
						});
					}else {
						const msgBox = document.createElement('p');
						msgBox.style.textAlign = 'center';
						msgBox.innerText = 'No custom properties';
						fragment.appendChild(msgBox);
					}
					customPropertyBox.appendChild(fragment);
				}
			}
	}
	store.getAll().onsuccess = event =>{
		const result = event.target.result;
		result.forEach(r=>{
			categories.push(r.name);
		});
		const propertyFragment = document.createDocumentFragment();
		categoryName.addOptions(...categories);
		detailsFragment.appendChild(itemName);
		detailsFragment.appendChild(categoryName);
		categoryName.inputChange(readProperties);
		propertyFragment.appendChild(priceInput);
		propertyFragment.appendChild(stockInput);
		propertyBox.appendChild(propertyFragment);
		detailsFragment.appendChild(propertyBox);
		detailsFragment.appendChild(nextBttn);
		customPropertiesFragment.appendChild(customPropertyBox);
		submitBttn.addEventListener('click', submitData);
		customPropertiesFragment.appendChild(submitBttn);
		const myMap = new Map();
		myMap.set('Deatils', detailsFragment);
		myMap.set('Custom properties', customPropertiesFragment);
		tabs.addTab(myMap);
		this.view.appendChild(tabs);
	}
}
export {Page, searchShelf, itemsPage, itemView, editItem, outofStock, newOrder, manageItems, categories, createCategory, showCategory, categoryInfo, editCategory, addItem};
