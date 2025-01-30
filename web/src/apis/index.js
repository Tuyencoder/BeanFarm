import axios from 'axios';

export const loginAPI = async (credentials) => {
    const response = await axios.post('http://localhost:8080/api/account/login', credentials);
    return response.data;
};
export const signupAPI = async (userData) => {
    const response = await axios.post('http://localhost:8080/api/account/signup', userData);
    return response.data;
};

export const fetchAllUserAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/account/all`);
    return response.data;
};

export const fetchUserInfoAPI = async (userId) => {
    const response = await axios.get(`http://localhost:8080/api/account/${userId}`);
    return response.data;
};

export const updateUserAPI = async (userId, updateData) =>
{
    const response = await axios.put(`http://localhost:8080/api/account/update/${userId}`,updateData)
    return response.data;
}
//Role 
export const fetchAllRolesAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/roles`);
    return response.data
}


export const CreateRoleAPI = async (updateData) => {
    const response = await axios.post(`http://localhost:8080/api/roles`, updateData)

    return response.data

}
export const updateRoleAPI = async (RoleId, updateData) => {
    const response = await axios.put(`http://localhost:8080/api/roles/${RoleId}`, updateData)

    return response.data

}
export const deleteRoleAPI = async (RoleId) => {
    const response = await axios.delete(`http://localhost:8080/api/roles/${RoleId}`);
    return response.data;
};

//Internal
export const GetAllInternalAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/account/internal`);
    return response.data;
};
export const fetchCountCustomerAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/account/count/customers`);
    return response.data;
};
export const GetAllCustomerAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/account/customers`);
    return response.data;
};
export const CreateInternalAPI = async (updateData, requesterId) => {
    const response = await axios.post('http://localhost:8080/api/account/create', updateData, {
        headers: {
            'requester-id': requesterId
        }
    });
    return response.data;
}

export const updateInternalAPI = async (UserId, updateData, requesterId) => {
    const response = await axios.put(`http://localhost:8080/api/account/update/internal/${UserId}`, updateData, {
        headers: {
            'requester-id': requesterId
        }
    });
    return response.data;
}

export const deleteUserAPI = async (UserId, requesterId) => {
    const response = await axios.delete(`http://localhost:8080/api/account/delete/${UserId}`, {
        headers: {
            'requester-id': requesterId
        }
    });
    return response.data;
};

//Category
export const fetchAllCategoriesAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/categories`);
    return response.data
}

export const fetchCountCategoriesAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/categories/count`);
    return response.data
}

export const CreateCategoryAPI = async (updateData) => {
    const response = await axios.post(`http://localhost:8080/api/categories/create`, updateData)

    return response.data

}
export const updateCategoryAPI = async (CategoryId, updateData) => {
    const response = await axios.put(`http://localhost:8080/api/categories/${CategoryId}`, updateData)

    return response.data

}
export const deleteCategoryAPI = async (CategoryId) => {
    const response = await axios.delete(`http://localhost:8080/api/categories/${CategoryId}`);
    return response.data;
};
//supplier
export const fetchAllSuppliersAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/suppliers`);
    return response.data
}

export const fetchCountSuppliersAPI = async () => {
    return response.data
}

export const CreateSuppliersAPI = async (updateData) => {
    const response = await axios.post(`http://localhost:8080/api/suppliers`, updateData)

    return response.data

}
export const updateSuppliersAPI = async (supplierId, updateData) => {
    const response = await axios.put(`http://localhost:8080/api/suppliers/${supplierId}`, updateData)

    return response.data

}
export const deleteSuppliersAPI = async (supplierId) => {
    const response = await axios.delete(`http://localhost:8080/api/suppliers/${supplierId}`);
    return response.data;
};
//product
export const fetchManagerAdminProductsAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/product/admin`);
    return response.data
}
export const fetchAllProductsAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/product`);
    return response.data
}

export const fetchOneProductsAPI = async (ProductId) => {
    const response = await axios.get(`http://localhost:8080/api/product/${ProductId}`);
    return response.data
}
export const CreateProductAPI = async (updateData) => {
    const response = await axios.post(`http://localhost:8080/api/product/create`, updateData)

    return response.data

}
export const updateProductAPI = async (ProductId, updateData) => {
    const response = await axios.put(`http://localhost:8080/api/product/${ProductId}`, updateData)

    return response.data

}
export const deleteProductAPI = async (ProductId) => {
    const response = await axios.delete(`http://localhost:8080/api/product/${ProductId}`);
    return response.data;
};

//Discount 
export const fetchAllDiscountsAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/discount/products`);
    return response.data
}
// Cart

export const fetchCartItemsAPI = async (accountId) => {
        const response = await axios.get(`http://localhost:8080/api/cart/${accountId}`);
        return response.data;
};

export const addToCartAPI = async (productId, quantity,accountId) => {
  
    const response = await axios.post(`http://localhost:8080/api/cart/add?productId=${productId}&quantity=${quantity}&accountId=${accountId}`);
    return response.data;
  
};


export const updateCartItemAPI = async (cartItemId, quantity) => {
  
    const response = await axios.put(`http://localhost:8080/api/cart/update/${cartItemId}?quantity=${quantity}`);
    return response.data;
  
};


export const deleteCartItemAPI = async (cartItemId) => {
        const response = await axios.delete(`http://localhost:8080/api/cart/delete/${cartItemId}`);
        return response.data;
};


//Order

export const fetchTotalPriceOrdersAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/orders/total`);
    return response.data;
}
export const fetchCountOrdersAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/orders/count`);
    return response.data;
}
export const fetchAllOrdersAPI = async () => {
    const response = await axios.get(`http://localhost:8080/api/orders`);
    return response.data;
};

export const fetchOneOrderAPI = async (OrderId) => {
    const response = await axios.get(`http://localhost:8080/api/orders/${OrderId}`);
    return response.data;
};

export const fetchAllOrdersCustomerAPI = async (accountId) => {
    const response = await axios.get(`http://localhost:8080/api/orders/customer/${accountId}`);
    return response.data;
};

export const addToOrderCustomerAPI = async (updateData) => {
  
    const response = await axios.post(`http://localhost:8080/api/orders`,updateData);
    return response.data;
  
};



export const updateOrderAPI = async (orderId, updateData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/orders/${orderId}`, updateData);
      return response.data; 
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error; 
    }
  };
  



export const deleteOrderAPI = async (OrderId) => {
        const response = await axios.delete(`http://localhost:8080/api/orders/${OrderId}`);
        return response.data;
};


// News
export const fetchAllNewsAPI = async () => {
    const response = await axios.get('http://localhost:8080/api/news');
    return response.data;
};

export const fetchOneNewsAPI = async (newsId) => {
    const response = await axios.get(`http://localhost:8080/api/news/${newsId}`);
    return response.data;
};

export const createNewsAPI = async (newsData) => {
    const response = await axios.post('http://localhost:8080/api/news', newsData);
    return response.data;
};

export const updateNewsAPI = async (newsId, newsData) => {
    const response = await axios.put(`http://localhost:8080/api/news/${newsId}`, newsData);
    return response.data;
};

export const deleteNewsAPI = async (newsId) => {
    const response = await axios.delete(`http://localhost:8080/api/news/${newsId}`);
    return response.data;
};
//voucher
export const fetchAllVoucherAPI = async () => {
    const response = await axios.get('http://localhost:8080/api/vouchers');
    return response.data;
};
export const fetchAllVoucherForAccountAPI = async (accountId) => {
    const response = await axios.get(`http://localhost:8080/api/vouchers/account/${accountId}`);
    return response.data;
};
export const fetchOneVoucherAPI = async (vouchers) => {
    const response = await axios.get(`http://localhost:8080/api/vouchers/${vouchersId}`);
    return response.data;
};

export const createVoucherAPI = async (newsData) => {
    const response = await axios.post('http://localhost:8080/api/vouchers', newsData);
    return response.data;
};
export const AccountApplyVoucherAPI = async (accountId, voucherCode) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/vouchers/apply?accountId=${accountId}&voucherCode=${voucherCode}`
      );
      return response.data; // Giả sử API trả về một đối tượng với trường `isApplied`
    } catch (error) {
      throw error;
    }
  };
  
  export const checkVoucherAppliedAPI = async (accountId, voucherCode) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/vouchers/check?accountId=${accountId}&voucherCode=${voucherCode}`
      );
      return response.data; // Ensure this is the expected field
    } catch (error) {
      throw error;
    }
  };

export const updateVoucherAPI = async (vouchersId, newsData) => {
    const response = await axios.put(`http://localhost:8080/api/vouchers/${vouchersId}`, newsData);
    return response.data;
};

export const deleteVoucherAPI = async (vouchersId) => {
    const response = await axios.delete(`http://localhost:8080/api/vouchers/${vouchersId}`);
    return response.data;
};

//VNPAY
export const initiateVNPAYPaymentAPI = async (orderData) => {
    const response = await axios.post(`http://localhost:8080/api/payment/create-payment`,orderData);
    return response.data;
}


//Coze
export const sendMessageAPI = async (messageData) => {
        const response = await axios.post('http://localhost:8080/api/chat/message', messageData);
        return response.data;
}
export const checkOldPasswordAPI = async (messageData) => {
    const response = await axios.post('http://localhost:8080/api/account/check-old-password', messageData);
    return response.data;
}
export const fetchMonthlyRevenue = async () => {
    const response = await axios.get('http://localhost:8080/api/orders/monthly-revenue');
    return response.data;
}