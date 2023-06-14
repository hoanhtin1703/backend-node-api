class ProductsModel {
  constructor(
    id,
    name,
    image_url,
    quantity,
    price,
    category_id,
    description,
    sold
  ) {
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.quantity = quantity;
    this.price = price;
    this.category_id = category_id;
    this.description = description;
    this.sold = sold;
  }
}
module.exports = ProductsModel;
