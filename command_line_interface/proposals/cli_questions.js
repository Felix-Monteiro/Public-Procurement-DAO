const readline = require('readline');
const util = require('node:util');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});
const question = util.promisify(rl.question).bind(rl);

//Modular Questions:
async function caller_private_key() {
    try {
        const answer = await question('Please provide your wallets private key:');
        console.log(`Your private key is ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function caller_address_request() {
    try {
        const answer = await question('Please provide your wallets address:');
        console.log(`Your wallets address is ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function proposal_description_request() {
    try {
        const answer = await question('Please provide the description of your proposal: ');
        console.log(`Your Proposal description is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Add Supplier process questions
async function supplier_name_request() {
    try {
        const answer = await question('Please provide Supplier Name: ');
        console.log(`Supplier Name: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function supplier_address_request() {
    try {
        const answer = await question('Please provide new Supplier Address: ');
        console.log(`New Supplier Address: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Revoke Supplier questions

async function supplier_id_request() {
    try {
        const answer = await question('Please provide Supplier ID:  ');
        console.log(`Supplier ID:  ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Add Board Member process questions
async function board_member_name_request() {
    try {
        const answer = await question('Please provide new Board Member Name: ');
        console.log(`New Board Member Name: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function board_member_address_request() {
    try {
        const answer = await question('Please provide new Board Member Address: ');
        console.log(`New Board Member Address: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function board_member_id_request() {
    try {
        const answer = await question('Please provide Board Member ID: ');
        console.log(`Board Member ID: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Vote process questions:

async function proposal_index_request() {
    try {
        const answer = await question('Please provide the respective Proposal ID: ');
        console.log(`Your Proposal ID is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function vote_way_request() {
    try {
        const answer = await question('(0 = Against, 1 = For, 2 = Abstain)\nPlease provide your vote: ');
        console.log(`Your Vote way is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

async function vote_reason_request() {
    try {
        const answer = await question('Please provide a vote justification: ');
        console.log(`Your Vote Reason is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Queue and Execute process questions:

async function function_request() {
    try {
        const answer = await question('Please provide the function called in the respective proposal: ');
        console.log(`Your function is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Contest Proposal

async function contest_name_request() {
    try {
        const answer = await question('Please provide the name of the Recruitment Contest: ');
        console.log(`Your Recruitment Contest is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

// Feedback Proposal

async function feedback_name_request() {
    try {
        const answer = await question('Please provide the name of your Feedback Proposal: ');
        console.log(`Your Feedback Proposal is: ${answer}\n`);
        return answer;
    } catch (err) {
        console.error('Error', err);
    }
}

module.exports = {
    caller_private_key,
    caller_address_request,
    proposal_description_request, supplier_name_request,
    supplier_address_request, supplier_id_request,
    board_member_name_request, board_member_address_request,
    board_member_id_request, proposal_index_request,
    vote_way_request, vote_reason_request, function_request,
    contest_name_request, feedback_name_request
};