// services/user.service.js
const inventoryRepository = require('../repositories/inventory.repository');

class InventoryService {
    async getAllProducts() {
        // Here you could add business logic, e.g., check user permissions
        return await inventoryRepository.findAll();
    }

    async getProductById(id) {
        const product = await inventoryRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData) {
        // Example of business logic: validate email format
        if (!productData.productName || !productData.productQuantity) {
            throw new Error('Invalid product format');
        }
        // Example of business logic: check for duplicate email
        // Note: The database already has a UNIQUE constraint, but doing it here
        // allows for a friendlier error message.
        return await inventoryRepository.create(productData);
    }

    async updateProduct(id, productData) {
        const product = await inventoryRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return await inventoryRepository.update(id, productData);
    }

    async deleteProduct(id) {
        const product = await inventoryRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return await inventoryRepository.delete(id);
    }

    async decrementProduct(items) {
        if(!Array.isArray(items) || items.length === 0) {
            throw new Error('Request body must be an array of { product_id, quantity } ');
        }

        const results = [];

        for(const item of items) {
            if(!item.product_id || !item.quantity) {
                throw new Error('Each item must include product_id & quantity');
            }
            const product = await inventoryRepository.findById(item.product_id);
            if(!product) {
                throw new Error('Product not found');
            }
            const quantity = product.productQuantity = item.quantity;
            if(quantity < 0) {
                throw new Error('Invalid value to decrement item ${product_id}');
            }
            await inventoryRepository.decrementProduct(item.product_id, quantity);
        }
        return { updated: items.length, items };
    }
}

module.exports = new InventoryService();
