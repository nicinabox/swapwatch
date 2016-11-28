start
  = tagged_title
  / plain_title

plain_title
  = title:phrase {
    return {
      title: title
    }
  }

tagged_title
  = location:location_raw "[H]" _ have:phrase "[W]" _ want:phrase _ {
    return {
      location: location,
      have: have,
      want: want
    }
  }
  / tag:tag title:phrase _ {
    return {
      tag: tag,
      title: title
    }
  }

tag
  = "[" tag:word "]" _ { return tag }

_
  = [ \t\n\r]*

word
  = $([a-zA-Z])*

phrase
  = phrase:$([^\[\]])+ { return phrase.trim() }

location
  = "[" country:word "-"? state:word? "]" _ {
    return {
      country: country,
      code: state
    }
  }

location_raw
  = "[" location:phrase "]" _ { return location }
