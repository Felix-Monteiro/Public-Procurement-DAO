#!/usr/bin/env bash
clear

echo "
____________________________________________________________
  ___                _ _           __  __              
 / __|_  _ _ __ _ __| (_)___ _ _  |  \/  |___ _ _ _  _ 
 \__ \ || | '_ \ '_ \ | / -_) '_| | |\/| / -_) ' \ || |
 |___/\_,_| .__/ .__/_|_\___|_|   |_|  |_\___|_||_\_,_|
          |_|  |_|                                               
____________________________________________________________
"

PS3='Please enter your choice: '
options=("Propose a Service" "Return to Main Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Propose a Service")
            echo "You chose to create a new proposal
            "
            yarn hardhat run command_line_interface/proposals/supplier_service.js --network goerli
            read -p "Press enter to return to the Supplier Menu..."
            bash bash_menus/supplier_menu.sh
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