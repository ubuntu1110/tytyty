@router.get("/cities_info", response_model=list[CityRead])
def cities_info(db: Session=Depends(get_db), user=Depends(get_current_user)):
    if user.role not in ["admin", "accountant"]:
        raise HTTPException(403, "Not enough permissions")
    return get_all_cities(db)
