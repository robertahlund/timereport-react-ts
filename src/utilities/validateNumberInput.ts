export const validateNumberInput = (value: string): boolean => {
    if(value !== "") {
        if (!Number(value)) {
            return false;
        }
    }
    return true;
};