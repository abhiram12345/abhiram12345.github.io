import {onNavigate, navigate} from './functions.js';
class HeaderBar extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		    <style>
			    header{
			        position:fixed;
			        display:flex;
		            justify-content:space-between;
		            align-items:center;
		            height:70px;
			        color:#303030;
			        background-color:#F0F8FF;
			        top:0;
			        right:0;
			        left:300px;
			        box-shadow:0 2px 10px lightgray;
			        overflow:hidden;
			        text-align:left;
			    }
			    .icons {
				   display:flex;
				   align-items:center;
				}
				.icons * {
					margin:0 15px;
				}
                .search-shelf{
				    display:flex;
				    color:gray;
				    align-items:center;
				    justify-content:space-between;
				    border:1.5px solid lightgray;
				    border-radius:5px;
				    flex-basis:250px;
				    padding:5px;
				    background-color:#ffffff;
				    font-size:12px;
				    margin-left:15px;
				}
				.search-shelf input[type="text"]{
				    border-radius:5px;
				    border:none;
				    outline:none;
				    background-color:transparent;
				}
				.search-shelf input::placeholder{
					color:#303030;
				}
				.search-shelf button{
				    border:none;
				    background-color:transparent;
				    color:black;
				}
		    </style>
		    <header>
		     <div>
	            <div class="search-shelf">
			    <input type="text" placeholder="Search shelf">
			    <button>
			    <span class="material-symbols-rounded">search</a>
			    </button>
			    </div>
            </div>
            <div class="icons">
	            <span class="material-symbols-rounded">notifications</span>
	            <span class="material-symbols-rounded">menu</span>
            </div>
            </header>`;
            this.attachShadow({mode:'open'});
		    this.shadowRoot.append(template.content.cloneNode(true));
	}
}
class HeaderBar2 extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		    <style>
		        header{
			        position:fixed;
			        display:flex;
		            justify-content:space-between;
		            align-items:center;
		            height:70px;
			        color:#000000;
			        background-color:#F0F8FF;
			        top:0;
			        right:0;
			        left:300px;
			        box-shadow:0 2px 10px lightgray;
			        overflow:hidden;
					z-index:1;
			    }
			    div{
				   display:flex;
				   align-items:center;
				}
				div * {
					margin:0 15px;
				}
		    </style>
		    <header>
		     <div>
	            <span class="material-symbols-rounded back-button">keyboard_backspace</span>
	            <h2></h2>
            </div>
            <div>
	            <span class="material-symbols-rounded">search</span>
	            <span class="material-symbols-rounded">notifications</span>
            </div>
            </header>
		`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.shadowRoot.querySelector('h2').innerText = this.hasAttribute('data-title') ? this.getAttribute('data-title') : '';
        this.shadowRoot.querySelector('.back-button').addEventListener('click', ()=> {
		    history.back();
		});
	}
}
class SideBar extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
		    .my-details{
				background-color:rgb(88, 166, 88);
				padding:10px 8px 8px 8px;
				margin:20px;
				width:60%;
				border-radius:5px;
				font-size:15px;
			}
			.my-details p{
                display:flex;
				align-items:center;
			}
			.my-details *{
                margin:2px;
			}
		    .menu-container{
			    position:fixed;
			    padding-top:10px;
			    width:300px;
				overflow:hidden;
			    top:0;
			    left:0;
			    background-color:#303030;
			    color:#707070;
			    height:100%;
			    z-index:2;
				font-family: Arial, Helvetica, sans-serif;
				color:white;
			}
			.menu{
			    margin:auto;
			}
			.menu h3{
			    font-weight:500;
			    margin:20px 30px;
			}
			.menu span{
				display:block;
				margin:10px 30px;
				width:150px;
				font-size:16px;
				color:#B8B8B8;
			}
			.menu .short-cut{
			    background-color:#4169e1;
			    color:white;
			    padding:5px;
			    border-radius:5px;
			}
			.menu .current-short-cut{
				background-color:green;
			}
			.menu .current{
				color:#ffffff;
			}
		</style>
        <section class="menu-container">
		<div class="my-details">
		<h4>New Ideal</h4>
		<p><span class="material-symbols-rounded">
		location_on
		</span><span>Thottuvakkom</span></P>
		</div>
	    <div class="menu">
	    <!--Items-->
	    <div class="menu-sections">
	    <span data-link="/">Items</span>
	    <span data-link="/outofstock">Out of stock</span>
	    <span data-link="/new-order">New Order</span>
	    <span data-link="/manage-items">Manage Items</span>
	    </div>
	    </div>
	    </section>`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback(){
		const links = this.shadowRoot.querySelectorAll('span');
		for (const link of links) {
			link.addEventListener('click', onNavigate);
		}
	}
}
class EmptyMessage extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	    <style>
	        div{
				width:100%;
	            display:flex;
	            flex-direction:column;
	            justify-content:center;
	            align-items:center;
				height:100vh;
	        }
	        span{
	            background-image:linear-gradient(green, blue);
	            -webkit-background-clip:text;
	            -webkit-text-fill-color:transparent;
	            font-size:50px;
	        }
	        p{
	            margin:10px auto;
	            color:#303030;
	            font-size:17px;
	        }
	    </style>
	        <div>
	         <span class="material-symbols-rounded">
	    	category
	    	</span>
	         <p>No items yet!</p>
	        </div>`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.shadowRoot.querySelector('span').innerText = this.getAttribute('icon');
		this.shadowRoot.querySelector('p').innerText = this.getAttribute('message');
	}
}
class GridMenu extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
	    <style>
	    div {
            display:grid;
		    gap:30px;
		    grid-template-columns:45% 45%;
		    padding:45px;
		    justify-content:space-around;
         }
         </style>
         <div>
         <slot name="block"></slot>
         </div>`;
         this.attachShadow({mode:'open'});
		 this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
class MenuBlock extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	    <style>
		div {
		    text-align:center;
		    border:2px solid gray;
		    padding:8px;
		    border-radius:5px;
		    color:#303030;
		    font-size:14px;
		}
		span {
		    display:block;
		    margin:7px;
		    color:#303030;
		}
		</style>
            <div data-link="">
            <span class="material-symbols-rounded"></span>
            <span class="title"></span>
            </div>`;
            this.attachShadow({mode:'open'});
		    this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.shadowRoot.querySelector('.material-symbols-rounded').textContent = this.getAttribute('icon');
		this.shadowRoot.querySelector('.title').textContent = this.getAttribute('title');
	}
}
class AddButton extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
	    <style>
		div{
			margin:auto;
			width:300px;
			box-sizing:border-box;
		}
	    button {
		    --padding:10px;
		    background-color:darkorange;
		    color:white;
		    width:300px;
		    padding:var(--padding);
		    border-radius:50px;
		    text-align:center;
		    position:fixed;
		    bottom:25px;
			border:none;
			box-sizing:border-box;
        }
		button:disabled{
			opacity:0.8;
		}
		</style>
		<div><button>Add</button></div>`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
    	this.shadowRoot.querySelector('button').textContent = this.hasAttribute('text') ? this.getAttribute('text') : 'Add';
        if (this.hasAttribute('padding')) {
        	this.shadowRoot.querySelector('button').style.setProperty('--padding', this.getAttribute('padding'));
        }
    }
} 
class AddData extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
	    <style>
	    input{
		   display:block;
		    border-radius:5px;
		    border:1.5px solid gray;
		    padding:15px;
		    color:#303030;
		    font-size:15px;
		    box-sizing:border-box;
		    width:70%;
		    margin:auto;
		}
		input:invalid{
			outline:red;
		}
		label{
		    display:block;
		    width:70%;
		    margin:20px auto;
		}
		p{
			display:block;
		    width:70%;
		    margin:10px auto;
		    color:red;
        }
        </style>
        <label for="input">Text</label>
        <p class=".error"></p>
        <input type="text" id="input" placeholder="text" maxlength="25">`;
        this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        const errorPara = this.shadowRoot.querySelector('p');
        const input = this.shadowRoot.querySelector('input');
        this.shadowRoot.querySelector('label').innerText = this.hasAttribute('data-label') ? this.getAttribute('data-label') : 'Label';
    	input.type = this.hasAttribute('type') ? this.getAttribute('type') : 'text';
        input.placeholder = this.hasAttribute('data-placeholder') ? this.getAttribute('data-placeholder') : '';
        if (this.hasAttribute('data-pattern')) {
        	input.setAttribute('pattern', this.getAttribute('data-pattern'));
        }
        input.addEventListener('keyup', function() {
            errorPara.innerText = this.validationMessage;
        });
    }
    get value() {
    	 return this.shadowRoot.querySelector('input').value;
    }
    set value(x) {
    	this.shadowRoot.querySelector('input').value = x;
    }
    set required(x) {
    	if (x === true) {
    	this.shadowRoot.querySelector('input').required = true;
        }
    }
    get validity() {
    	return this.shadowRoot.querySelector('input').checkValidity();
    }
	onEnter(callback){
        this.shadowRoot.querySelector('input').addEventListener('keypress', (e)=>{
			if (e.key == 'Enter') {
				callback();
			}
		});
	}
}
class AddNumber extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
	    <style>
	    input{
		   display:block;
		    border-radius:5px;
		    border:1.5px solid gray;
		    padding:15px;
		    color:#303030;
		    font-size:15px;
		    box-sizing:border-box;
		    width:70%;
		    margin:auto;
		}
		input:invalid{
			outline:red;
		}
		label{
		    display:block;
		    width:70%;
		    margin:20px auto;
		}
		p{
			display:block;
		    width:70%;
		    margin:10px auto;
		    color:red;
        }
        </style>
        <label for="input">Text</label>
        <p></p>
        <input type="number" id="input" placeholder="text" step = "1" required>`;
        this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        const errorPara = this.shadowRoot.querySelector('p');
        const input = this.shadowRoot.querySelector('input');
        this.shadowRoot.querySelector('label').innerText = this.hasAttribute('data-label') ? this.getAttribute('data-label') : 'Label';
        input.placeholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : '';
        input.step = this.hasAttribute('step') ? this.getAttribute('step') : '1';
        input.addEventListener('keyup', function() {
            errorPara.innerText = this.validationMessage;
        })
    }
    static get observedAttributes() {
    	return ['data-label'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    	this.shadowRoot.querySelector('label').innerText = this.hasAttribute('data-label') ? this.getAttribute('data-label') : 'Label';
    }
    get value() {
    	 return this.shadowRoot.querySelector('input').value;
    }
    set value(x) {
    	this.shadowRoot.querySelector('input').value = x;
    }
    validity() {
    	return this.shadowRoot.querySelector('input').checkValidity();
    }
}
class SubmitData extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
	    <style>
	    button {
		    display:block;
		    margin:30px auto;
		    background-color:darkorange;
		    padding:15px;
		    border:none;
		    border-radius:5px;
		    width:70%;
		    color:white;
		    box-sizing:border-box;
         }
         </style>
         <button>Submit</button>`;
         this.attachShadow({mode:'open'});
		 this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
    	const button = this.shadowRoot.querySelector('button');
        button.innerText = this.hasAttribute('data-label') ? this.getAttribute('data-label') : 'Submit';
        button.style.backgroundColor = this.hasAttribute('data-color') ? this.getAttribute('data-color') : 'darkorange';
    }
    static get observedAttributes() {
    	return ['data-label'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    	this.shadowRoot.querySelector('button').innerText = this.hasAttribute('data-label') ? this.getAttribute('data-label') : 'Label';
    }
}
class CategoryBlock extends HTMLElement {
    constructor() {
        super();
		const template = document.createElement('template');
		template.innerHTML = `
		<style>
		    div{
			    margin:20px auto;
			    padding:20px;
			    width:80%;
			    border-radius:5px;
			    background-color:#ffffff;
			    color:#303030;
			    box-shadow:0 1px 10px lightgray;
			}
		</style>
		<div></div>
		`;
        this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
    	this.shadowRoot.querySelector('div').textContent = this.getAttribute('data-name');
    }
}
class AddProperty extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<style>
		    div{
			    color:#f8f8f8;
			    font-size:15px;
                margin:25px auto;
			    border-radius:5px;
			    padding:15px 20px;
			    background-color:#303030;
			    width:70%;
			    box-sizing:border-box;
			    text-align:center;
			}
		</style>
		<div>Custom property +</div>
        `;
        this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
	}
}
class CustomSelect extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
		    .title{
		        width:70%;
		        margin:20px auto;
		        width:100%;
			}
		    .custom{
			   position:relative;
			   color:#303030;
		       width:70%;
			   box-sizing:border-box;
			   margin:auto;
			}
		    .selected-option{
			    border-radius:5px;
			    border:1.5px solid gray;
			    padding:13px;
			    color:#303030;
			    font-size:15px;
			    box-sizing:border-box;
			    width:100%;
			    margin: 25px auto;
			    background-color:white;
			    display:flex;
			    justify-content:space-between;
			}
			select{
				display:none;
			}
			.drop-down{
				display:none;
				position:absolute;
				background-color:#ffffff;
				font-size:15px;
				border:1px solid lightgray;
				color:#303030;
				top:30px;
				right:0;
				width:60%;
			}
			.drop-down > div{
				width:100%;
				text-align:left;
				padding:15px;
				box-sizing:border-box;
			}
			.drop-down > div:not(:last-child){
				border-bottom:1px solid lightgray;
			}
        </style>
        <div class="custom">
        <select>
        </select>
        <div class="title">label</div>
        <div class="selected-option">
        <span class="selected"></span>
        <span class="material-symbols-rounded">
	    	arrow_drop_down
	    	</span>
	    </div>
	    <div class="drop-down">
	    </div>
        </div>
        `;
        this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const div = this.shadowRoot.querySelector('.selected-option');
		const selected = this.shadowRoot.querySelector('.selected');
		const select = this.shadowRoot.querySelector('select');
		const dropDown = this.shadowRoot.querySelector('.drop-down');
		selected.innerText = select.value;
		const showSelect = (e) =>{
			div.removeEventListener('click', showSelect);
			const options = select.options;
			for (let option of options){
			    const newDiv = document.createElement('div');
			    newDiv.innerText = option.text;
			    newDiv.addEventListener('click', function() {
				    for (let i=0; i<options.length;i++) {
					    if (this.innerText === options[i].text){
						    select.selectedIndex = i;
						    selected.innerText = select.value;
						}
					}
                 });
			    dropDown.appendChild(newDiv);
			}
			dropDown.style.display = 'block';
			const closeSelect = () =>{
				div.addEventListener('click', showSelect);
				while (dropDown.hasChildNodes()) {
					dropDown.removeChild(dropDown.firstChild);
					dropDown.style.display = 'none';
				}
			}
			e.stopPropagation();
			document.addEventListener('click', closeSelect);
		}
		div.addEventListener('click', showSelect);
		this.shadowRoot.querySelector('.title').innerText = this.hasAttribute('data-label')? this.getAttribute('data-label') : 'Label';
	}
	addOptions(...options) {
		const select = this.shadowRoot.querySelector('select');
	        options.forEach(e =>{
				const option = document.createElement('option');
				option.text = e;
				select.add(option);
			});
	}
	get value() {
    	 return this.shadowRoot.querySelector('select').value;
    }
    inputChange(func) {
    	const mainDiv = this.shadowRoot.querySelector('.drop-down');
    	const divs = mainDiv.querySelectorAll('div');
        mainDiv.addEventListener('click', func);
    }
}
class ItemBlock extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<style>
		.item{
			margin:20px auto;
			padding:20px;
			width:80%;
			border-radius:5px;
			background-color:#ffffff;
			color:#303030;
			font-size:14px;
			box-shadow:0 1px 10px lightgray;
		}
		span{
			display:inline-block;
			color:darkred;
			padding:5px 10px;
			border:1px solid gray;
			border-radius:50px;
			font-size:14px;
			box-sizing:border-box;
			margin:3px 3px 3px 0;
		}
		.category{
			border-color:#001253;
			color:#001253;
		}
		.tagline{
		    color:gray;
		    font-size:14px;
		    margin:10px 0;
		}
		</style>
		<div class="item">
       <p><p>
       <div class="price tagline"></div>
       <div class="stock tagline"></div>
       <br/>
       <span class="category"></span>
       </div>`;
       this.attachShadow({mode:'open'});
       this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const title = this.shadowRoot.querySelector('p');
		const  price = this.shadowRoot.querySelector('.price');
		const stock = this.shadowRoot.querySelector('.stock');
		const properties = this.shadowRoot.querySelectorAll('span');
		title.innerText = this.hasAttribute('data-item-name') ? this.getAttribute('data-item-name') : 'Item';
		price.innerText = this.hasAttribute('data-price') ? this.getAttribute('data-price') != '' ? `₹${this.getAttribute('data-price')}` : 'Not specified' : '- : -';
		stock.innerText = this.hasAttribute('data-stock') ? this.getAttribute('data-stock') != '' ? this.getAttribute('data-stock') == 1 ? '1 item left' : `${this.getAttribute('data-stock')} Items left` : 'Not specified'  : '- : -';
		if (this.hasAttribute('data-category-name')) {
			this.shadowRoot.querySelector('.category').innerText = this.getAttribute('data-category-name');
        }else {
        	this.shadowRoot.querySelector('.category').style.display = 'none';
        }
	}
	showProperties(...properties) {
		const parent = this.shadowRoot.querySelector('.item');
		properties.forEach(p =>{
			const span = document.createElement('span');
			span.innerText = `${p.name} : ${p.value}`;
			if (p.value) {
			    parent.appendChild(span);
			}
			else{alert('hi')}
        });
	}
}
class CategoryView extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
		div{
			display:flex;
			justify-content:space-between;
			align-items:center;
			width:80%;
			padding:0 10px 0 0;
			margin:auto;
			border-bottom:1.5px solid lightgray;
		}
		p{
			color:#303030;
			font-size:18px;
			font-weight:bold;
		}
		span{
			color:orange;
		}
       .material-symbols-outlined {
            font-variation-settings:
		    'FILL' 0,
		    'wght' 400,
		    'GRAD' 0,
		    'opsz' 48
       }
		</style>
		<div>
		<p></p>
		<span class="material-symbols-rounded">
info
</span>
		</div>
		`;
		this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
    }
    connectedCallback() {
    	const p = this.shadowRoot.querySelector('p');
        p.innerText = this.hasAttribute('data-name') ? this.getAttribute('data-name') : 'Not found';
    }
}
class CustomProperty extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
		.prop{
		    margin:20px auto;
		    width:70%;
		    color:gray;
		    font-size:14px;
		    font-family:Arial;
		    border-radius:5px;
		    box-shadow:0 1px 10px lightgray;
		    padding:10px;
		    display:flex;
		    align-items:center;
		    justify-content:space-around;
		    box-sizing:border-box;
        }
		span{
		    color:darkred;
		}
		</style>
		<div class="prop">
            <div>
            <div class='name'>Custom property : Color</div>
            <div><i></i></div>
            </div>
            <span class="material-symbols-rounded">
cancel
</span>
        </div>`;
        this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const name = this.shadowRoot.querySelector('.name');
		const dataType = this.shadowRoot.querySelector('i');
		name.innerText = this.hasAttribute('data-name') ? `Custom property : ${this.getAttribute('data-name')}` : '';
		dataType.innerText = this.hasAttribute('data-type') ? `Data type : ${this.getAttribute('data-type')}` : '';
	}
	giveFunc(x) {
		this.shadowRoot.querySelector('span').addEventListener('click', x.bind(this));
	}
}
//info-box
class InfoBox extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <style>
        .container{
		    margin:auto;
		    position:relative;
		    width:85%;
		    border-radius:12px;
		    box-shadow:0 1px 10px lightgray;
		    padding:20px;
		    font-size:15px;
		    color:#303030;
		    height:200px;
		}
		.edit{
			position:absolute;
		    display:flex;
		    align-items:center;
		    justify-content:center;
		    background-color:darkorange;
		    color:white;
		    border-radius:50%;
		    width:42px;
		    height:42px;
		    left:50%;
		    bottom:-19px;
		    transform:translate(-50%, 0);
		}
        </style>
        <div class="container">
            <div class="name"></div>
            <div class="stock"></div>
            <div class="outofstock">
            </div>
            <div class="edit">
            <span class="material-symbols-rounded">
edit
</span>
        </div>
        </div>`;
        this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const catName = this.shadowRoot.querySelector('.name');
		const stock = this.shadowRoot.querySelector('.stock');
		const outOfStock = this.shadowRoot.querySelector('.outofstock');
		catName.innerText = this.hasAttribute('data-name') ? `Category : ${this.getAttribute('data-name')}` : '';
		stock.innerText = this.hasAttribute('data-stock-number') ? `Stock : ${this.getAttribute('data-stock-number')}` : '';
		outOfStock.innerText = this.hasAttribute('data-outofstock') ? `Out of stock : ${this.getAttribute('data-outofstock')}` : '';
	}
	set editable(x) {
		if (x === false) {
			this.shadowRoot.querySelector('.edit').style.display = 'none';
		}
	}
}
//itemView
class ItemView extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
		.container{
		    background-color:white;
		    font-size:14px;
		    color:#303030;
		    width:80%;
		    padding:10px;
		    box-shadow:0 1px 10px lightgray;
		    margin:auto;
		    padding:20px;
		}
		p{
			color:#808080;
		}
		.edit{
			float:right;
			color:#E26868;
			background-color:#EDEDED;
			padding:5px;
			border-radius:5px;
		}
		.item-name{
		    clear:both;
	    }
	   span{
			display:inline-block;
			color:blue;
			padding:5px 10px;
			border:1px solid #0081C9;
			border-radius:50px;
			font-size:14px;
			box-sizing:border-box;
			margin:3px 3px 3px 0;
			background-color:#bbd0f7;
		}
		</style>
		<div class="container">
		<div class="edit"><strong>Edit</strong></div>
       <h2 class="item-name"></h2>
       <p class="item-price"></p>
       <p class="item-stock"></p>
       <p class = "item-category"></p>
       </div>`;
       this.attachShadow({mode:'open'});
       this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const item = this.shadowRoot.querySelector('.item-name');
		const price = this.shadowRoot.querySelector('.item-price');
        const stock = this.shadowRoot.querySelector('.item-stock');
        const category = this.shadowRoot.querySelector('.item-category');
        item.innerText = this.hasAttribute('data-item-name') ? this.getAttribute('data-item-name') : 'Not Found';
        price.innerText = this.hasAttribute('data-price') ? `Price : ${this.getAttribute('data-price')}` : 'Not Found';
        stock.innerText = this.hasAttribute('data-stock') ? `Stock : ${this.getAttribute('data-stock')}` : 'Not Found';
        category.innerText = this.hasAttribute('data-category') ? `Category : ${this.getAttribute('data-category')}` : '';
	}
	static get observedAttributes() {
    	return ['data-stock'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    	this.shadowRoot.querySelector('.item-stock').innerText = `Stock : ${this.getAttribute('data-stock')}`;
    }
    showProperties(...properties) {
		const parent = this.shadowRoot.querySelector('.container');
		properties.forEach(p =>{
			if (p.value) {
				const span = document.createElement('span');
				span.innerText = `${p.name} : ${p.value}`;
				parent.appendChild(span);
			}
        });
	}
	get editButton() {
		return this.shadowRoot.querySelector('.edit');
	}
}
//foot notifiacation
class FootNotification extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		    <style>
		        div{
			        display:flex;
			        position:absolute;
			        overflow:hidden;
			        padding:0 20px;
			        background-color:green;
			        color:#F6FBF4;
			        justify-content:space-between;
			        align-items:center;
			        height:60px;
			        transition:height 1s;
			        left:0;
			        right:0;
		            bottom:0;
		            z-index:1;
                }
                p{
                	flex-basis:60%;
                    opacity:1;
                    transition:opacity 0.5s;
                }
                span{
                	opacity:1;
                	transition:opacity 1s;
                    display:none;
                }
            </style>
            <div>
                <p></p>
                <span><b></b></span>
            </div>
        `;
        this.attachShadow({mode:'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const messageBody = this.shadowRoot.querySelector('p');
		messageBody.innerText = this.hasAttribute('data-message') ? this.getAttribute('data-message') : '';
		setTimeout(() =>{
			this.shadowRoot.querySelector('p').style.opacity = '0.1';
			this.shadowRoot.querySelector('span').style.opacity = '0.1'; 
			this.shadowRoot.querySelector('div').style.height = 0;
			setTimeout(()=> {
				this.remove();
			}, 1000);
        }, 5000);
	}
}
class RoundedButton2 extends HTMLElement {
	constructor(){
		super();
		const template = document.createElement('template');
	    template.innerHTML = `
	        <style>
	            button{
		            display:block;
		            text-align:center;
		            width:180px;
		            color:white;
		            padding:14px;
		            border-radius:25px;
		            border:none;
		            margin:auto;
		            background-color:darkorange;
		            font-size:15px;
		        }
	        </style>
	        <button></button>`;
	   this.attachShadow({mode:'open'});
	   this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		const button = this.shadowRoot.querySelector('button');
		if (this.hasAttribute('data-text')) {
			button.innerText = this.getAttribute('data-text');
		}
		if (this.hasAttribute('data-bg-color')) {
			button.style.backgroundColor = this.getAttribute('data-bg-color');
		}
	}
}
//tabs
class Tabs extends HTMLElement{
	constructor(){
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <style>
				p{
					display:flex;
					justify-content: space-around;
					width: 80%;
					margin:auto auto 40px auto;
				}
				span{
					padding: 5px;
					box-sizing: border-box;
					height: 30px;
				}
				.active {
					border-bottom: 2px solid darkorange;
				}
				.container {
					height: 400px;
					width: 80%;
					margin:auto;
				}
				.container * {
                    animation:fadeDiv 0.5s;
				}
				.container > *:not(:first-child){
					display:none;
				}
				@keyframes fadeDiv{
					from{
						opacity:0;
					}
					to{
						opacity:1;
					}
				}
			</style>
			<p>
			</p>
			<div class="container">
			</div>
		`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback(){
		this.shadowRoot.querySelector('p span').className='active';
		const navs = this.shadowRoot.querySelectorAll('p span');
		const slides = this.shadowRoot.querySelector('div').children;
		for (let i=0; i < navs.length; i++) {
			navs[i].addEventListener('click', (e)=>{
				const active = this.shadowRoot.querySelector('.active');
				if (active){
				active.classList.remove('active');
				}
				e.target.classList.add('active');
				for (let slide of slides){
					slide.style.display = 'none';
				}
				slides[i].style.display = 'block';
			});
		}
	}
	addTab(data) {
       if (data instanceof Map) {
          data.forEach((value, key)=> {
			const tabHead = document.createElement('span');
			const tabContent = document.createElement('div');
			tabHead.innerText = key;
			tabContent.appendChild(value);
			this.shadowRoot.querySelector('p').appendChild(tabHead);
			this.shadowRoot.querySelector('div').appendChild(tabContent);
		  });
	   }else {
		console.log('Data is not a type of Map');
	   }
	}
	nextTab() {
	    const current = this.shadowRoot.querySelector('.active');
		current.nextElementSibling.click();
	}
}
//two-column
class TwoColumn extends HTMLElement{
	constructor(){
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <style>
			    .container {
					display:flex;
					width:100%;
					justify-content:space-between;
				}
				.container div:first-of-type {
					flex-basis:70%;
				}
			</style>
			<div class="container">
			    <div>
				hi
				</div>
				hi
				<div>
				</div>
			</div>
		`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.append(template.content.cloneNode(true));
	}
	addContent(content, column) {
        this.shadowRoot.querySelectorAll('.content div')[column].appendChild(content);
	}
}
class ModalBox extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		    <style>
				.background {
					position:fixed;
					top:0;
					right:0;
					bottom:0;
					left:0;
					background-color: rgb(0,0,0); /* Fallback color */
                    background-color: rgba(0,0,0,0.4);
					z-index:3;
				}
				.modal{
					position:absolute;
					background-color:#ffffff;
					border:1px solid gray;
					border-radius:5px;
					width:60%;
					left:50%;
					top:50%;
					transform: translate(-50%, -50%);
					z-index:4;
				}
				span{
					float:right;
					margin:10px;
					color:#303030;
				}
			</style>
			<div class="background">
			</div>
			<div class="modal">
			<span class="material-symbols-rounded">
close
</span>
			<div class="content"></div>
			</div>
		`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback() {
		this.shadowRoot.querySelector('span').addEventListener('click', ()=>{
			this.remove();
		})
	}
	addContent(content) {
        this.shadowRoot.querySelector('.content').appendChild(content);
	}
}
class itemSimple extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
		    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		    <style>
				div{
					width:80%;
					margin:auto;
					padding:5px 20px;
                    border-radius:5px;
		            border:1px solid lightgray;
				}
				p {
                  font-size:15px;
				  margin:4px;
				}
				span{
				  font-size:14px;
				  color:gray;
				}
			</style>
			<div>
			<p><p>
			<span></span>
			</div>
			`;
		this.attachShadow({mode:'open'});
		this.shadowRoot.append(template.content.cloneNode(true));
	}
	connectedCallback(){
		this.shadowRoot.querySelector('p').innerText = this.hasAttribute('data-title') ? this.getAttribute('data-title') : '';
		this.shadowRoot.querySelector('span').innerText = this.hasAttribute('data-sub-title') ? this.getAttribute('data-sub-title') : '';
	}
}
customElements.define('header-bar', HeaderBar);
customElements.define('header-bar-2', HeaderBar2);
customElements.define('side-bar', SideBar);
customElements.define('empty-message', EmptyMessage);
customElements.define('grid-menu', GridMenu);
customElements.define('menu-block', MenuBlock);
customElements.define('add-button', AddButton);
customElements.define('add-data', AddData);
customElements.define('add-number', AddNumber);
customElements.define('submit-data', SubmitData);
customElements.define('category-block', CategoryBlock);
customElements.define('add-property', AddProperty);
customElements.define('custom-select', CustomSelect);
//321
customElements.define('item-block', ItemBlock);
customElements.define('category-view', CategoryView);
//504
customElements.define('custom-property', CustomProperty);
//551
customElements.define('info-box', InfoBox);
//664
customElements.define('item-view', ItemView);
customElements.define('foot-notification', FootNotification);
customElements.define('rounded-button-2', RoundedButton2);
customElements.define('horizontal-tabs', Tabs);
customElements.define('two-columns', TwoColumn);
customElements.define('modal-box', ModalBox);
customElements.define('item-simple', itemSimple);
