
function replacer(key,value){
    if(key === "userTradeList" || key === "searchedUserTradeList"){
        let obj = {};
        let list = [];
            for(var i =0; i< value.length;i++){
                obj.name=value[i].name;
                obj.condition= value[i].condition;
                obj.id = value[i].id;
                obj.price = value[i].price;
                list.push(obj);
            }
        return list;
    }else{
        return value;
    }

}

export const createTrade = (token,trade) => {


    console.log(JSON.stringify(trade,replacer));
    

    return fetch(`${process.env.REACT_APP_API_URL}/trade/requestTrade`, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(trade)
    })
        .then(response => response.json())
        .then((data) =>{
          console.log('success:',data);
        })
        .catch(err =>{
            console.log(err);
        
        })
};