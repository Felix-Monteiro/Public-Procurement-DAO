#!/usr/bin/env bash
clear

echo "
________________________________________________________________________

  /\   _| ._ _  o ._  o  _ _|_ ._ _. _|_ o     _    |\/|  _  ._      
 /--\ (_| | | | | | | | _>  |_ | (_|  |_ | \/ (/_   |  | (/_ | | |_|                                                                      
________________________________________________________________________
"

PS3='Please enter your choice: '
options=("Propose - New Supplier" "Propose - Revoke Supplier" "Propose - New Board Member" "Propose - Revoke Board Member" "Propose - New Recruitment Contest" "Return to Main Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Propose - New Supplier")
            echo "You chose to propose the addition of a new Supplier
            "
            yarn hardhat run command_line_interface/proposals/add_supplier.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Propose - Revoke Supplier")
            echo "You chose to propose the revocation of a Supplier
            "
            yarn hardhat run command_line_interface/proposals/revoke_supplier.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Propose - New Board Member")
            echo "You chose to propose the addition of a new Board Member
            "
            yarn hardhat run command_line_interface/proposals/add_board_member.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Propose - Revoke Board Member")
            echo "You chose to propose the revocation of a Board Member
            "
            yarn hardhat run command_line_interface/proposals/revoke_board_member.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
            ;;
        "Propose - New Recruitment Contest")
            echo "You chose to propose a New Recruitment Contest
            "
            yarn hardhat run command_line_interface/proposals/recruitment_contest.js --network goerli
            read -p "Press enter to return to the Administrative Menu..."
            bash bash_menus/administrative_menu.sh
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