# router
A simple folder-based router.

Takes a `Request`, returns a `Promise<Response>`;

## Pages
`/pages`

Will be served on `/`. 

Supports simple `.tsx` or `.jsx` files. Purely SSR for the moment.

Example:
If you would like a page under `/home`.

At `/pages/page.tsx`:
```
export default function Page() {
    return <div>Home Page</div>;
}
```

### Redirects
If you have some logic (ex: is logged in) that checks if the user should go to another page first, use `redirect`.

`/pages/admin/page.tsx`
```
import { redirect } from "@webly/router";

export default function Page() {
    if (!isLoggedIn) {
        // optional
        return redirect('/admin/login');
    }

    return <div>Admin Page</div>;
}
```

`/pages/admin/login/page.tsx`
```
import { redirect } from "@webly/router";

export default function Page() {
    if (isLoggedIn) {
        // optional
        return redirect('/admin');
    }

    return <div>Login Form</div>;
}
```

## Static Files
`/static`

Will be served on `/static`.

Any assets that your site needs can be kept here.

Example: if you would like to use your `logo.png` on your site.

Put the file in `/static/logo.png`.
```
export default function Page() {

    return <div><img src="/static/logo.png"></div>;
}
```

## Uploads
`/uploads`

Will be served on `/uploads`

Intended for files that are dynamically uploaded through your site's logic.

# Usage
```
import { handleRequest } from "@webly/router";

function(req: Request): Promise<Response> {
    return handleRequest(req);
}
```