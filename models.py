from pydantic import BaseModel, ConfigDict, Field


class Restaurant(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=60)
    note: str = Field(min_length=1, max_length=200)
