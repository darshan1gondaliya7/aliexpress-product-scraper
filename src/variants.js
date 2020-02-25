module.exports = {
  get: function(skuModule) {
    const priceLists = skuModule.skuPriceList || [];
    const optionsLists = skuModule.productSKUPropertyList || [];

    const options = optionsLists.map(list => {
      return {
        id: list.skuPropertyId,
        name: list.skuPropertyName,
        values: list.skuPropertyValues.map(val => {
          return {
            id: val.propertyValueId,
            name: val.propertyValueName,
            displayName: val.propertyValueDisplayName,
            image: val.skuPropertyImagePath
          };
        })
      };
    });

    const lists = priceLists.map(list => {
      let  listOriginalPrice  =  (list.skuVal.skuAmount)?list.skuVal.skuAmount.value:0;
      let listSalePrice       =  (list.skuVal.skuActivityAmount)?list.skuVal.skuActivityAmount.value:0;

      return {
        skuId: list.skuId,
        optionValueIds: list.skuPropIds,
        availableQuantity: list.skuVal.availQuantity,
        originalPrice: listOriginalPrice,
        salePrice: listSalePrice
      };
    });

    return {
      options: options,
      prices: lists
    };
  }
};
