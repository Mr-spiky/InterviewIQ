from bson import ObjectId


def doc_to_dict(doc: dict) -> dict:
    """Convert MongoDB document _id ObjectId to string id."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc


def str_to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        return None
