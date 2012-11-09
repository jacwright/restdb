restdb
======

A RESTful database: inspired by CouchDB, built with JavaScript, on Node.js, backed by leveldb, at one with the web.

*Why?* I thought it would be fun, and I feel it could be just as robust, scalable, and secure as any other database. It's
more about the architecture and algorithms, and less about the language.

Getting Started
---------------
```
npm install -g https://github.com/jacwright/restdb/archive/master.tar.gz
```

Then run `restdb` via the command-line and go to http://localhost:3030/. You should get a 404 Not Found.

To add an image called myimage.png to the database at the url /images/me.png try:

```
curl localhost:3030/images/me.png -XPUT -H "Content-Type: image/png" --data-binary @myimage.png
```

Then go to http://localhost:3030/images/me.png in your browser. You should see the image you've just added.

To remove it:

```
curl localhost:3030/images/me.png -XDELETE
```

Refresh your browser at http://localhost:3030/images/me.png and see a 404 Not Found.

Concept
-------

restdb is built for [REST](http://en.wikipedia.org/wiki/Representational_state_transfer).
This is similar to [CouchDB](http://couchdb.apache.org/)
and [Riak](http://basho.com/products/riak-overview/). However, unlike these two databases with a prescribed
API (e.g. in CouchDB the document with id documentId inside the database dbName would be accessed at
http://example.com/dbName/documentId) the documents in restdb can exist at any URL hosted by the
restdb (e.g. a post document for your blog could be placed anywhere, at http://example.com/blog/posts/post-url
or http://example.com/1234). restdb loves to work with JSON data, though it can store any type of document:
images, text, HTML, CSS, binary, etc.

To add a document you can do an HTTP PUT to a URL and it will be added. To retrieve that document back simply
do an HTTP GET to that same URL. And, a DELETE will remove it. A POST can also add a document, but it will use
either data in the JSON document, a header, or additional post data to determine the last part of the URL.

To provide security, fine-grained user permissions, create sorted lists, and to provide document validation,
restdb allows the storage of apps. Apps are JSON documents that contain JavaScript code and settings that apply to
documents underneath them. For example, a Blog app could be added to my database at the URL /my-musings/_blog.
Then any documents added to the database underneath /my-musings/ will be run through the rules of the blog app.
Apps always begin with an underscore to differentiate them from all other documents.

Apps
----

Apps provide your database validation, security, user permissions, custom indexes (map/reduce), document
merging strategies, and dynamic documents (the ability to create a document on the fly from other documents,
for example, RSS feeds or HTML templates on JSON data).

More about apps how apps are formatted will be coming.

Changes
-------

restdb will have a changes feed like couchdb has. This will allow system components to respond to changes in
the database in realtime.

Database Application Hosting
----------------------------

Because of restdb's features, full apps, multiple apps, and websites can and should be hosted from restdb directly.
Serve your application from your database. This is like CouchDB's CouchApps.

Technology
----------

restdb is built on Node.js. Because the main bottle-neck of a database is the disk and network IO, JavaScript can
compete with other languages for speed. And Node.js has shown to be every bit as fast in IO intensive applications
as others with its V8 engine. In addition, because the database is written in JavaScript, the apps stored in the
database might be optimized to run faster without a languageOfChoice-to-JavaScript bridge. And finally, there are
more developers who can contribute to the development of restdb because there are more who know JavaScript than
say Erlang.

restdb should be able to run as a single instance or in a ring of redundant servers, dynamo-style.

Roadmap
-------

  * Provide basic REST methods. --Partially done, haven't done POST
  * Support specialized _app documents to get parsed and run in-memory
  * Allow apps to deny saving of documents below their level (document validation)
  * Allow apps to map documents into new indexes (like CouchDB views), accessed at /index-name
  * Allow apps to define routes which will use some logic in displaying documents or indexes
  * Provide a changes feed
  * Create a default app which allows for document and app editing and creation from within the browser (like CouchDB Futon)
  * Add security, authentication, user management and allow apps to use that to provide control over their documents
  * Update default app to provide real-time performance, statistics, and information
  * Create dynamo-style architecture allowing nodes to connect across processes and machines in a ring, each process owning
  its own leveldb database and storing documents redundantly across processes and machines.
  * Update default app to support the cluster, to add and remove nodes from the cluster, to view rebalancing data
  * Recruit database gurus to shore up our database to make it stable, robust, and mature

