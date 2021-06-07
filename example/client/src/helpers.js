export function parseBool(val) {
    if ((typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes')) || val === 1)
        return true;
    else if ((typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no')) || val === 0)
        return false;

    return null;
}
