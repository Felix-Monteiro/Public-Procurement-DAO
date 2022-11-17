#!/usr/bin/env bash
clear

echo "
____________________________________________________________________________________
  ___           _           ___                _ _           __  __              
 / __| ___ _ _ (_)___ _ _  / __|_  _ _ __ _ __| (_)___ _ _  |  \/  |___ _ _ _  _ 
 \__ \/ -_) ' \| / _ \ '_| \__ \ || | '_ \ '_ \ | / -_) '_| | |\/| / -_) ' \ || |
 |___/\___|_||_|_\___/_|   |___/\_,_| .__/ .__/_|_\___|_|   |_|  |_\___|_||_\_,_|
                                    |_|  |_|                                                     
____________________________________________________________________________________                                    
                                    "

PS3='Please enter your choice: '
options=("Propose a Service" "Feedback Proposal" "Return to Main Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Propose a Service")
            echo "You chose to create a new proposal
            "
            yarn hardhat run command_line_interface/proposals/supplier_service.js --network goerli
            read -p "Press enter to return to the Senior Supplier Menu..."
            bash bash_menus/senior_supplier_menu.sh
            ;;
        "Feedback Proposal")
            echo "You chose to submit a feedback proposal
            "
            yarn hardhat run command_line_interface/proposals/senior_feedback.js --network goerli
            read -p "Press enter to return to the Senior Supplier Menu..."
            bash bash_menus/senior_supplier_menu.sh
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