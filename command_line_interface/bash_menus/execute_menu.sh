#!/usr/bin/env bash
clear

echo ""

PS3='Please enter your choice: '
options=("New Supplier Proposal" "New Board Member Proposal" "Revoke a Supplier Proposal" "Revoke a Board Member Proposal" "Recruitment Contest Proposal" "Service Application Proposal" "Feedback Proposal" "Return to Main Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "New Supplier Proposal")
            echo "You chose to execute a New Supplier Proposal"
            yarn hardhat run command_line_interface/execute/add_supplier.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "New Board Member Proposal")
            echo "You chose to execute a New Board Member Proposal"
            yarn hardhat run command_line_interface/execute/add_board_member.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Revoke a Supplier Proposal")
            echo "You chose to execute a Revoke a Supplier Proposal"
            yarn hardhat run command_line_interface/execute/revoke_supplier.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Revoke a Board Member Proposal")
            echo "You chose to execute a Revoke a Board Member Proposal"
            yarn hardhat run command_line_interface/execute/revoke_board_member.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Recruitment Contest Proposal")
            echo "You chose to execute a Recruitment Contest Proposal"
            yarn hardhat run command_line_interface/execute/recruitment_contest.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Service Application Proposal")
            echo "You chose to execute a Service Application Proposal"
            yarn hardhat run command_line_interface/execute/supplier_service.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Feedback Proposal")
            echo "You chose to execute a Feedback Proposal"
            yarn hardhat run command_line_interface/execute/senior_feedback.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/execute_menu.sh
            ;;
        "Return to Main Menu")
            bash ./main_menu.sh
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

exec bash