const readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});

//Modular Questions:
async function caller_address_request() {
    const response = rl.question('Please provide your wallets address: ', function (answer) {
        console.log(`Your wallets address is: ${answer} \n`);
        rl.close();
    });

    return response;
}

async function proposal_description_request() {
    const response = rl.question('Please provide the description of your proposal: ', function (answer) {
        console.log(`Your Proposal description is: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Add Supplier process questions
async function supplier_name_request() {
    const response = rl.question('Please provide Supplier Name: ', function (answer) {
        console.log(`Supplier Name: ${answer} \n`);
        rl.close();
    });

    return response;
}

async function supplier_address_request() {
    const response = rl.question('Please provide new Supplier Address: ', function (answer) {
        console.log(`New Supplier Address: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Revoke Supplier questions

async function supplier_id_request() {
    const response = rl.question('Please provide Supplier ID: ', function (answer) {
        console.log(`Supplier ID: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Add Board Member process questions
async function board_member_name_request() {
    const response = rl.question('Please provide new Board Member Name: ', function (answer) {
        console.log(`New Board Member Name: ${answer} \n`);
        rl.close();
    });

    return response;
}

async function board_member_address_request() {
    const response = rl.question('Please provide new Board Member Address: ', function (answer) {
        console.log(`New Board Member Address: ${answer} \n`);

        rl.close();
    });

    return response;
}

async function board_member_id_request() {
    const response = rl.question('Please provide Board Member ID: ', function (answer) {
        console.log(`Board Member ID: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Vote process questions:

async function proposal_index_request() {
    const response = rl.question('Please provide the respective Proposal Index: ', function (answer) {
        console.log(`Your Proposal Index is: ${answer} \n`);
        rl.close();
    });

    return response;
}

async function vote_way_request() {
    const response = rl.question('(0 = Against, 1 = For, 2 = Abstain)\nPlease provide your vote: ', function (answer) {
        console.log(`Your Vote way is: ${answer} \n`);
        rl.close();
    });

    return response;
}

async function vote_reason_request() {
    const response = rl.question('Please provide a vote justification: ', function (answer) {
        console.log(`Your Vote Reason is: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Queue and Execute process questions:

async function function_request() {
    const response = rl.question('Please provide the function called in the respective proposal: ', function (answer) {
        console.log(`Your function is: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Contest Proposal

async function contest_name_request() {
    const response = rl.question('Please provide the name of the Recruitment Contest: ', function (answer) {
        console.log(`Your Recruitment Contest is: ${answer} \n`);
        rl.close();
    });

    return response;
}

// Feedback Proposal

async function feedback_name_request() {
    const response = rl.question('Please provide the name of your Feedback Proposal: ', function (answer) {
        console.log(`Your Feedback Proposal is: ${answer} \n`);
        rl.close();
    });

    return response;
}