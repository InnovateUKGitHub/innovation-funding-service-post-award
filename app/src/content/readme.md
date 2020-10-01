# Content #

I18next is used as the internationalization library in our app.

## Custom Content ##

By default content will be loaded from`./app/src/content/defaultContent.en.json` and will need to be committed to source control.

Custom content can be loaded from a file in an Amazon S3 bucket by setting the environment variables:

```
FEATURE_CUSTOM_CONTENT=true
S3_Access_Key=< S3 Access key ID >
S3_Secret=< S3 Secret Access key>
S3_Content_Bucket=< The name of the S3 bucket >
S3_Content_File=< The S3 object key >
```

Any content added to the custom content file will supersede the default content.

 ## Using Content with React ##
 
 The `Content` component `src/ui/components/content.tsx`, should be used to render content.
 It accepts a `ContentSelector` (a lookup function) and returns a React Node.
 
 ### Development use ###
 
 To help visualise where the `Content` component has been used in the site,
 the environment variable `FEATURE_CONTENT_HINT` can be set to true.
 This will highlight areas of the site where content has been used and will display the content key and value in a modal.
 **Do not enable in production**
 
 ### Content by competition type ###
 
 Currently only supported as additional content file in source control. Further work needed to support hosting in Amazon S3 bucket.
 
 See use of `crdComopetitionContent.en.json`
 
 