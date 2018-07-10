# Konachan (Moebooru) APIs

This API documentation is created in July 2018, and for specifically the 
Konachan.net / Konachan.com sites. Things could change if applied on other
sites or Moebooru gets updated.

## Posts

Usage: `/post.json?limit=[limit=21]&page=[page=1]&tags=[tags]`

The page will return an array of posts if succeeded. 

Useful information are (self-explanatory attributes are marked "." in description):

| name             | type   | description                                     |
| ---------------- | ------ | ----------------------------------------------- |
| id               | number | .                                               |
| tags             | string | .                                               |
| created_at       | number | Unix timestamp                                  |
| creator_id       | number | user ID                                         |
| author           | string | name of the **uploader** (not original creator) |
| source           | string | source website                                  |
| score            | number | .                                               |
| md5              | string | HEX of the picture's md5                        |
| rating           | string | rating of the picture. See Notes                |
| -                |
| file_url         | string | url of the **original** picture file            |
| width            | number | .                                               |
| height           | number | .                                               |
| file_size        | number | size of the picture                             |
| -                |
| preview_url      | string | url of the **preview** of the picture.          |
| preview_width    | number | .                                               |
| preview_height   | number | .                                               |
| -                |
| sample_url       | string | url of the **sample** of the picture            |
| sample_width     | number | .                                               |
| sample_height    | number | .                                               |
| sample_file_size | number | .                                               |
| -                |
| jpeg_url         | string | url to the **JPEG version** of the picture      |
| jpeg_width       | number | .                                               |
| jpeg_height      | number | .                                               |
| jpeg_file_size   | number | .                                               |

If nothing matches the query, the page will return an empty array (`[]`).

If an error occurs (such as *searching for more than 6 tags at once*), the page will return an object:

| name    | type   | description                                     |
| ------- | ------ | ----------------------------------------------- |
| success | bool   | always false, because it clearly didn't succeed |
| reason  | string | reason of failure                               |

### Notes

- Preview pictures have their longest side 300px long.
- For sample ones this value is 1500px
- Ratings
  - s: safe
  - q: questionable
  - e: explicit
- **For getting the information of a specific post, use `tags=id:[id]`**


### Example

This is a sample of post data fetched from `/post.json` when succeeded

```json
[
  {
    "id": 267948,
    "tags": "animal aqua_eyes black_hair bubbles fan fish japanese_clothes kimono original tr_(hareru)",
    "created_at": 1531104543,
    "creator_id": 73632,
    "author": "otaku_emmy",
    "change": 1515714,
    "source": "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=69553970",
    "score": 6,
    "md5": "12d031e23511b2ce82ca0f2926ad011f",
    "file_size": 5796667,
    "file_url": "//konachan.net/image/12d031e23511b2ce82ca0f2926ad011f/Konachan.com%20-%20267948%20animal%20aqua_eyes%20black_hair%20bubbles%20fan%20fish%20japanese_clothes%20kimono%20original%20tr_%28hareru%29.png",
    "is_shown_in_index": true,
    "preview_url": "//konachan.net/data/preview/12/d0/12d031e23511b2ce82ca0f2926ad011f.jpg",
    "preview_width": 150,
    "preview_height": 95,
    "actual_preview_width": 300,
    "actual_preview_height": 190,
    "sample_url": "//konachan.net/sample/12d031e23511b2ce82ca0f2926ad011f/Konachan.com%20-%20267948%20sample.jpg",
    "sample_width": 1500,
    "sample_height": 948,
    "sample_file_size": 727831,
    "jpeg_url": "//konachan.net/jpeg/12d031e23511b2ce82ca0f2926ad011f/Konachan.com%20-%20267948%20animal%20aqua_eyes%20black_hair%20bubbles%20fan%20fish%20japanese_clothes%20kimono%20original%20tr_%28hareru%29.jpg",
    "jpeg_width": 2976,
    "jpeg_height": 1881,
    "jpeg_file_size": 907223,
    "rating": "s",
    "has_children": false,
    "parent_id": null,
    "status": "active",
    "width": 2976,
    "height": 1881,
    "is_held": false,
    "frames_pending_string": "",
    "frames_pending": [],
    "frames_string": "",
    "frames": []
  },
  {
    "id": 267947,
    //  ...
  },
  // ...
]
```

## Comment

TBD.