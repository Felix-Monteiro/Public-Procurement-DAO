#!/usr/bin/env bash
clear

echo "
________________________________________________________________________

  /\   _| ._ _  o ._  o  _ _|_ ._ _. _|_ o     _    |\/|  _  ._      
 /--\ (_| | | | | | | | _>  |_ | (_|  |_ | \/ (/_   |  | (/_ | | |_|                                                                      
________________________________________________________________________
"

PS3='Please enter your choice: '
options=("Create a Proposal" "Vote on a Proposal" "Delegate Governance Tokens" "Return to Main Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Create a Proposal")
            echo "You chose to create a new proposal
            "
            bash bash_menus/administrative_proposals.sh
            ;;
        "Vote on a Proposal")
            echo "You chose to vote on a specific Proposal"
            yarn hardhat run command_line_interface/proposals/vote.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Delegate Governance Tokens")
            echo "You chose to Delegate Governance Tokens"
            yarn hardhat run command_line_interface/proposals/delegate_governance_tokens.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Return to Main Menu")
            bash ../main_menu.sh
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

exec bash