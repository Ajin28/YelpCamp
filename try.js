for (let i = 0; i < 3; i++) {

    let num = Math.random();
    new Promise((res, rej) => {
        setTimeout(() => { res("one" + i) }, 1000)
    }).then(obj => {
        console.log(obj)
        console.log(num)
        return new Promise((res, rej) => {
            setTimeout(() => { res("two" + i) }, 1000)
        })
    }).then(obj => {
        console.log(obj)
        console.log(num)
        return new Promise((res, rej) => {
            setTimeout(() => { res("three" + i) }, 4000)
        })
    }).then(obj => {
        console.log(obj)
        console.log(num)
        return new Promise((res, rej) => {
            setTimeout(() => { res("four" + i) }, 1000)
        })
    }).then(obj => {
        console.log(obj)
        console.log(num)
        return new Promise((res, rej) => {
            setTimeout(() => { res("five" + i) }, 8000)
        })
    }).then(obj => {
        console.log(obj)
        console.log(num)



    })

    console.log("LOOP FINISHED")
}

//Output with let i
// one0
// one1
// one2
// two0
// two1
// two2
// three0
// three1
// three2
// four0
// four1
// four2
// five0
// five1
// five2

//Till the time promise resolves for finishes
//Output with var i
// one3
// one3
// one3
// two3
// two3
// two3
// three3
// three3
// three3
// four3
// four3
// four3
// five3
// five3
// five3