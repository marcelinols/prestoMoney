import React from 'react'

const format = (val) => {
    return '$ ' + val.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const stringAvatar = (name) => {
    return {
        sx: {
            bgcolor: "#eeeeee",
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const suma = (datos) => {
    let sum = datos.reduce(function (prev, current) {
        return prev + +current.amount
    }, 0);

    return sum;
}

export { format, stringAvatar, suma }
