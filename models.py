from pydantic import BaseModel, ConfigDict, Field


class Tip(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    tip: str = Field(min_length=1, max_length=200)


class Spot(Tip):
    name: str = Field(min_length=1, max_length=60)
