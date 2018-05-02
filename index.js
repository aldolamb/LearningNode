var socket = io()
$(() => {
    $("#send").click(() => {
        var message = { name: $("#name").val(), message: $("#message").val()}
        postMessage(message)
    })
    $("#clear").click(() => {
        clearMessages()
    })
    getMessages()
})

socket.on('message', addMessage)

function addMessage(message){
    $("#messages").append(`<h4> ${message.strain_name} </h4> <p> ${message.message} </p>`)
}

function addStrain(strain, index){
    const cols = `<th>${index + 1}</th>` + Object.keys(strain).map((key) => {
        return `<td contenteditable='true' onchange="callMe(${index})">${strain[key]}</td>`
    }).join().replace(/null/g, "");
    // reduce((x, str) => str += x);

    return `<tr>${cols}</tr>`;
    // $("#strains").append(`<tr> <td> ${strain.strain_name} </td> <td> ${strain.genotype} <td> </td>`)
}

function callMe(rowIndex) {
    console.log(rowIndex);
}

// $(function() {
//     var previous = $("#strains").text();
//     $check = function() {
//         if ($("#strains").text() != previous) {
//             myOwnFunction();
//         }
//         previous = $("#strains").text();
//     }
//     setInterval(function() { $check(); }, 1000);
// })
//
// function myOwnFunction() {
//     alert("CHANGED");
// }

function getMessages() {
    $.get('http://localhost:3000/messages', (data) => {
        var header = `<th>#</th>` + Object.keys(data[0]).map((key) => {
            return `<th>${key}</th>`});

        $("#strains").append(`<thead><tr>${header}</tr></thead>`);

        var rows = data.map(addStrain);
        $("#strains").append(`<tbody>${rows}</tbody>`);
    })
}

function postMessage(message) {
    $.post('http://localhost:3000/messages', message)
}

function clearMessages() {
    $.post('http://localhost:3000/reset', "")
}