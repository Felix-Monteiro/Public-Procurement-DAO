#!/bin/bash

clear
echo "
____________________________________________________________________________________________
     ___      _    _ _      ___                 _ _                 _     ___   _   ___  
    | _ \_  _| |__| (_)__  | _ \___ __ _ _ _  _(_) |_ _ __  ___ _ _| |_  |   \ /_\ / _ \ 
    |  _/ || | '_ \ | / _| |   / -_) _| '_| || | |  _| '  \/ -_) ' \  _| | |) / _ \ (_) |
    |_|  \_,_|_.__/_|_\__| |_|_\___\__|_|  \_,_|_|\__|_|_|_\___|_||_\__| |___/_/ \_\___/ 
____________________________________________________________________________________________                                                                                                                                                        
"
echo " ⚡ Welcome to the Prototype of a Public Recruitment Decentralised Autonomous Organisation! ⚡

Start by selecting your Role's Menu:
"

PS3='Please enter your choice: '
options=("Administrative Menu" "Supplier Menu" "Senior Supplier Menu" "Queue and Execute Menu" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Administrative Menu")
            echo "You chose to open the Administrative Menu 
            "
            bash bash_menus/administrative_menu.sh
            ;;
        "Supplier Menu")
            echo "You chose to open the Supplier Menu
            "
            bash bash_menus/supplier_menu.sh
            ;;
        "Senior Supplier Menu")
            echo "You chose to open the Senior Supplier Menu
            "
            bash bash_menus/senior_supplier_menu.sh
            ;;
        "Queue Menu")
            echo "You chose to open the Queue Menu
            "
            bash bash_menus/queue_menu.sh
            ;;
        "Execute Menu")
            echo "You chose to open theExecute Menu
            "
            bash bash_menus/execute_menu.sh
            ;;
        "Quit")
            echo "Thank you for your time!"
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

exec bash