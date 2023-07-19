import {searchShelf, itemsPage, itemView, editItem, outofStock, newOrder, manageItems, categories, createCategory, showCategory, categoryInfo, editCategory, addItem} from './ascript.js';
//router obj
const routes = {
    '/' : itemsPage,
    '/item-view' : itemView,
    '/edit-item' : editItem,
    '/outofstock' : outofStock,
    '/new-order' : newOrder,
    '/manage-items' : manageItems,
    '/categories' : categories,
    '/create-category' : createCategory,
    '/show-category' : showCategory,
    '/info-box' : categoryInfo,
    '/edit-category' : editCategory,
    '/add-item' : addItem
};
export {routes};
