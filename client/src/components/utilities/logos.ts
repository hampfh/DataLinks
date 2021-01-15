import GROUP_ICON from "assets/icons/interfacePack/svg/group.svg"
import CALCULATOR_ICON from "assets/icons/interfacePack/svg/calculator.svg"
import DOCUMENT_ICON from "assets/icons/interfacePack/svg/document-3.svg"
import COMPUTER_ICON from "assets/icons/interfacePack/svg/computer.svg"

export enum LOGO {
    GROUP = "GROUP",
    CALCULATOR = "CALCULATOR",
    DOCUMENT = "DOCUMENT",
    COMPUTER = "COMPUTER"
}

export function getSubjectIcon(logo: LOGO): string {
    switch (logo) {
        case LOGO.GROUP:
            return GROUP_ICON
        case LOGO.CALCULATOR:
            return CALCULATOR_ICON
        case LOGO.DOCUMENT:
            return DOCUMENT_ICON
        case LOGO.COMPUTER:
            return COMPUTER_ICON
        default:
            return GROUP_ICON
    }
}