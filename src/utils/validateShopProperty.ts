export default (shop: any): boolean => {
  if (
    shop.staff.length > 0 &&
    shop.address.length > 0 &&
    shop.service.length > 0 &&
    shop.is_deleted === false &&
    shop.category &&
    shop.category !== "" &&
    shop.phone &&
    shop.phone !== "" &&
    shop.start_time &&
    shop.start_time !== "" &&
    shop.end_time &&
    shop.end_time !== ""
  ) {
    return true;
  }

  return false;
};
