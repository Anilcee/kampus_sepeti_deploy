--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.addresses (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying NOT NULL,
    address text NOT NULL,
    city character varying NOT NULL,
    district character varying NOT NULL,
    postal_code character varying,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.addresses OWNER TO kampus_sepeti;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.cart_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO kampus_sepeti;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    parent_id character varying,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO kampus_sepeti;

--
-- Name: exam_booklets; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.exam_booklets (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    exam_id character varying NOT NULL,
    booklet_code character varying NOT NULL,
    question_order jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_booklets OWNER TO kampus_sepeti;

--
-- Name: exam_sessions; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.exam_sessions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    exam_id character varying NOT NULL,
    student_id character varying NOT NULL,
    booklet_type character varying NOT NULL,
    student_answers jsonb,
    score integer,
    percentage numeric(5,2),
    status character varying DEFAULT 'started'::character varying NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_sessions OWNER TO kampus_sepeti;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.exams (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    subject character varying NOT NULL,
    duration_minutes integer NOT NULL,
    total_questions integer NOT NULL,
    answer_key jsonb NOT NULL,
    acquisitions jsonb,
    acquisition_codes jsonb,
    question_subjects jsonb,
    question_tests jsonb,
    created_by_admin_id character varying NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exams OWNER TO kampus_sepeti;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.order_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    order_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.order_items OWNER TO kampus_sepeti;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO kampus_sepeti;

--
-- Name: product_exams; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.product_exams (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    product_id character varying NOT NULL,
    exam_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_exams OWNER TO kampus_sepeti;

--
-- Name: products; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    original_price numeric(10,2),
    discount_percentage integer DEFAULT 0,
    category_id character varying NOT NULL,
    image_url character varying,
    is_active boolean DEFAULT true,
    stock integer DEFAULT 0,
    rating numeric(3,2) DEFAULT '0'::numeric,
    review_count integer DEFAULT 0,
    has_coaching boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO kampus_sepeti;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO kampus_sepeti;

--
-- Name: user_exam_access; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.user_exam_access (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    exam_id character varying NOT NULL,
    order_id character varying,
    access_granted_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_exam_access OWNER TO kampus_sepeti;

--
-- Name: users; Type: TABLE; Schema: public; Owner: kampus_sepeti
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    phone character varying,
    address text,
    city character varying,
    district character varying,
    postal_code character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO kampus_sepeti;

--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.addresses (id, user_id, title, first_name, last_name, phone, address, city, district, postal_code, is_default, created_at, updated_at) FROM stdin;
23e74383-34d4-4bc7-9c14-492df2c884e5	a99b88f6-9001-4627-bb97-7ace02b48996	a	A	CENGİZ	05415835100	A	İstanbul	İstanbul	34070	t	2025-09-01 03:32:13.930357	2025-09-01 03:32:13.930357
05798881-965b-4a0a-83d3-a3e1ef17dc84	be12a25a-3f17-420e-b5ca-1b160cd28bfe	a	Circir mahallesi Uludağ caddesi no 15	Cengiz	05415835100	Circir mahallesi Uludağ caddesi no 15	Eyüp	Eyüp	34070	t	2025-09-01 04:32:26.352049	2025-09-01 04:32:26.352049
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.cart_items (id, user_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.categories (id, name, slug, parent_id, display_order, created_at) FROM stdin;
5772806d-c678-4572-8ff8-fb0de3fd3754	İlkokul	ilkokul	\N	0	2025-09-01 03:15:07.642683
15ebf543-b3c8-475d-b432-36613ed45bed	Ortaokul	ortaokul	\N	0	2025-09-01 03:15:07.642683
53f5f9c9-0632-4f12-914f-3e6c089bba81	Lise	lise	\N	0	2025-09-01 03:15:07.642683
665b2b66-683b-47b5-8be0-845d8f17b057	YKS	yks	\N	0	2025-09-01 03:15:07.642683
\.


--
-- Data for Name: exam_booklets; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.exam_booklets (id, exam_id, booklet_code, question_order, created_at) FROM stdin;
\.


--
-- Data for Name: exam_sessions; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.exam_sessions (id, exam_id, student_id, booklet_type, student_answers, score, percentage, status, started_at, completed_at, created_at) FROM stdin;
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.exams (id, name, description, subject, duration_minutes, total_questions, answer_key, acquisitions, acquisition_codes, question_subjects, question_tests, created_by_admin_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at) FROM stdin;
a1e25596-db44-48ac-8852-3514ce13b51a	4446c16f-acdf-484b-862c-20e918f1e38a	fe0374e3-b4cb-48ff-8432-e5f3a191e064	9	45.00	2025-09-01 03:32:20.389454
b96cdd91-3fe9-4b19-8c99-af7b0a58fb30	4446c16f-acdf-484b-862c-20e918f1e38a	e6059a9c-0873-4229-b920-38cb703d1f1a	11	35.00	2025-09-01 03:32:20.389454
972cea75-ad6e-4c7a-a239-18402eafc1cd	4446c16f-acdf-484b-862c-20e918f1e38a	70ee05e4-c8e3-437e-9a1b-c095fee44ee4	3	55.00	2025-09-01 03:32:20.389454
808ac7d0-37ab-4eef-b739-abca4923f37e	4446c16f-acdf-484b-862c-20e918f1e38a	e4282276-10fb-4141-9e2d-16dce19beb5d	1	40.00	2025-09-01 03:32:20.389454
e2a3b259-e98a-42fa-a9fe-568044bd0d4a	77ce2932-bfa2-471c-aa4b-3858d23f68dd	d90ac5bc-29e1-4468-9d90-ef0a1a6fc2b3	1	65.00	2025-09-01 03:33:32.210556
79cbb1e4-25fd-4d80-8dda-1b2f94467024	0be518b0-4c1a-4426-a39c-17b09c206655	70ee05e4-c8e3-437e-9a1b-c095fee44ee4	2	55.00	2025-09-01 04:32:42.447891
e087e7d5-c704-47f1-b39d-c222e72ecaab	0be518b0-4c1a-4426-a39c-17b09c206655	e4282276-10fb-4141-9e2d-16dce19beb5d	4	40.00	2025-09-01 04:32:42.447891
d7b1b00d-9b00-40d4-a9fe-ed17d0255cf5	0be518b0-4c1a-4426-a39c-17b09c206655	d90ac5bc-29e1-4468-9d90-ef0a1a6fc2b3	2	65.00	2025-09-01 04:32:42.447891
bfdc8f27-5651-4bd0-bd6a-43ee50b10700	0be518b0-4c1a-4426-a39c-17b09c206655	b4c02de8-f16b-4ec2-88d1-bec883c788fc	1	1.00	2025-09-01 04:32:42.447891
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.orders (id, user_id, total_amount, status, created_at, updated_at) FROM stdin;
4446c16f-acdf-484b-862c-20e918f1e38a	a99b88f6-9001-4627-bb97-7ace02b48996	995.00	pending	2025-09-01 03:32:20.389454	2025-09-01 03:32:20.389454
77ce2932-bfa2-471c-aa4b-3858d23f68dd	a99b88f6-9001-4627-bb97-7ace02b48996	65.00	shipped	2025-09-01 03:33:32.210556	2025-09-01 00:56:32.617
0be518b0-4c1a-4426-a39c-17b09c206655	be12a25a-3f17-420e-b5ca-1b160cd28bfe	401.00	pending	2025-09-01 04:32:42.447891	2025-09-01 04:32:42.447891
\.


--
-- Data for Name: product_exams; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.product_exams (id, product_id, exam_id, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.products (id, name, slug, description, price, original_price, discount_percentage, category_id, image_url, is_active, stock, rating, review_count, has_coaching, created_at, updated_at) FROM stdin;
fe0374e3-b4cb-48ff-8432-e5f3a191e064	TYT Matematik Deneme Kitabı	tyt-matematik-deneme	TYT Matematik konularını kapsayan kapsamlı deneme kitabı	45.00	\N	0	665b2b66-683b-47b5-8be0-845d8f17b057	https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300	t	91	4.50	25	f	2025-09-01 03:15:14.697652	2025-09-01 00:32:20.394
e6059a9c-0873-4229-b920-38cb703d1f1a	LGS Türkçe Deneme Kitabı	lgs-turkce-deneme	LGS Türkçe konularını içeren deneme kitabı	35.00	\N	0	15ebf543-b3c8-475d-b432-36613ed45bed	https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300	t	64	4.20	18	f	2025-09-01 03:15:14.697652	2025-09-01 00:32:20.397
70ee05e4-c8e3-437e-9a1b-c095fee44ee4	AYT Fizik Deneme Kitabı	ayt-fizik-deneme	AYT Fizik konularını kapsayan deneme kitabı	55.00	\N	0	665b2b66-683b-47b5-8be0-845d8f17b057	https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300	t	45	4.80	32	f	2025-09-01 03:21:30.900907	2025-09-01 01:32:42.454
e4282276-10fb-4141-9e2d-16dce19beb5d	LGS Matematik Deneme Kitabı	lgs-matematik-deneme	LGS Matematik konularını içeren deneme kitabı	40.00	\N	0	15ebf543-b3c8-475d-b432-36613ed45bed	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300	t	55	4.60	28	f	2025-09-01 03:21:30.900907	2025-09-01 01:32:42.456
d90ac5bc-29e1-4468-9d90-ef0a1a6fc2b3	9. Sınıf Kimya Konu Anlatımı	9-sinif-kimya	9. Sınıf Kimya konu anlatım kitabı	65.00	\N	0	53f5f9c9-0632-4f12-914f-3e6c089bba81	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300	t	27	4.40	15	f	2025-09-01 03:21:30.900907	2025-09-01 01:32:42.458
b4c02de8-f16b-4ec2-88d1-bec883c788fc	LGS Fen Bilimleri Mega Deneme	lgs-fen-bilimleri-mega-deneme	a	1.00	1.00	0	5772806d-c678-4572-8ff8-fb0de3fd3754	https://cdn.kitapsec.com/image/urun/2024/01/23/1706001597.jpg	t	56	0.00	0	f	2025-09-01 04:19:30.261106	2025-09-01 01:32:42.459
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.sessions (sid, sess, expire) FROM stdin;
Mx7zpyhRTqFovCs2UXA0A2drS-0vHT2z	{"user": {"id": "a99b88f6-9001-4627-bb97-7ace02b48996", "city": null, "role": "user", "email": "test@test.com", "phone": null, "address": null, "district": null, "lastName": "User", "password": "$2b$10$Y.nSpw6VosYLCgNwO7e9S.4oCpMd6ELPgD7fwvD/ji1olFOV6dBaG", "createdAt": "2025-09-01T03:21:21.469Z", "firstName": "Test", "updatedAt": "2025-09-01T03:21:21.469Z", "postalCode": null, "profileImageUrl": null}, "cookie": {"path": "/", "secure": false, "expires": "2025-09-08T00:29:09.391Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "a99b88f6-9001-4627-bb97-7ace02b48996"}	2025-09-08 03:29:10
4N3fZzk08V0PasnowqB82A7iG318tyAB	{"user": {"id": "a99b88f6-9001-4627-bb97-7ace02b48996", "city": null, "role": "user", "email": "test@test.com", "phone": null, "address": null, "district": null, "lastName": "User", "password": "$2b$10$Y.nSpw6VosYLCgNwO7e9S.4oCpMd6ELPgD7fwvD/ji1olFOV6dBaG", "createdAt": "2025-09-01T03:21:21.469Z", "firstName": "Test", "updatedAt": "2025-09-01T03:21:21.469Z", "postalCode": null, "profileImageUrl": null}, "cookie": {"path": "/", "secure": false, "expires": "2025-09-08T00:31:05.083Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "a99b88f6-9001-4627-bb97-7ace02b48996"}	2025-09-08 03:31:06
1abx592MzPAEQcavoGZweqBq5BMJ4P-l	{"user": {"id": "be12a25a-3f17-420e-b5ca-1b160cd28bfe", "city": null, "role": "admin", "email": "kampussepeti@gmail.com", "phone": null, "address": null, "district": null, "lastName": "Sepeti", "password": "$2b$10$zJVYN09LFm8K2GsszJBHJe0ack4t5.YLy4zpHSyZrBS1NK6IE6o9m", "createdAt": "2025-09-01T03:34:59.151Z", "firstName": "Kampüs", "updatedAt": "2025-09-01T03:34:59.151Z", "postalCode": null, "profileImageUrl": null}, "cookie": {"path": "/", "secure": false, "expires": "2025-09-08T01:36:48.307Z", "httpOnly": true, "sameSite": "lax", "originalMaxAge": 604800000}, "userId": "be12a25a-3f17-420e-b5ca-1b160cd28bfe"}	2025-09-08 04:36:49
\.


--
-- Data for Name: user_exam_access; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.user_exam_access (id, user_id, exam_id, order_id, access_granted_at, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kampus_sepeti
--

COPY public.users (id, email, password, first_name, last_name, profile_image_url, role, phone, address, city, district, postal_code, created_at, updated_at) FROM stdin;
df43f780-eceb-48f1-9c65-fc7be74a3c08	admin@kampussepeti.com	$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hI6jK7lM8nO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8yY9zZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW3xX4yY5zZ	Admin	User	\N	admin	\N	\N	\N	\N	\N	2025-09-01 03:14:55.666885	2025-09-01 03:14:55.666885
a99b88f6-9001-4627-bb97-7ace02b48996	test@test.com	$2b$10$Y.nSpw6VosYLCgNwO7e9S.4oCpMd6ELPgD7fwvD/ji1olFOV6dBaG	Test	User	\N	user	\N	\N	\N	\N	\N	2025-09-01 03:21:21.469379	2025-09-01 03:21:21.469379
527135e0-008b-4091-83e1-f90284673c42	alikemal@test.com	$2b$10$kfIHd8crbJulvjrB9b6cjuRYrl6NLJrGIRIDj9L8tYptXSigxRe8C	Anıl	Cengiz	\N	user	\N	\N	\N	\N	\N	2025-09-01 03:22:03.349455	2025-09-01 03:22:03.349455
be12a25a-3f17-420e-b5ca-1b160cd28bfe	kampussepeti@gmail.com	$2b$10$zJVYN09LFm8K2GsszJBHJe0ack4t5.YLy4zpHSyZrBS1NK6IE6o9m	Kampüs	Sepeti	\N	admin	\N	\N	\N	\N	\N	2025-09-01 03:34:59.151727	2025-09-01 03:34:59.151727
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: exam_booklets exam_booklets_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exam_booklets
    ADD CONSTRAINT exam_booklets_pkey PRIMARY KEY (id);


--
-- Name: exam_sessions exam_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exam_sessions
    ADD CONSTRAINT exam_sessions_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_exams product_exams_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.product_exams
    ADD CONSTRAINT product_exams_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: user_exam_access user_exam_access_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.user_exam_access
    ADD CONSTRAINT user_exam_access_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: kampus_sepeti
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: addresses addresses_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: exam_booklets exam_booklets_exam_id_exams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exam_booklets
    ADD CONSTRAINT exam_booklets_exam_id_exams_id_fk FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: exam_sessions exam_sessions_exam_id_exams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exam_sessions
    ADD CONSTRAINT exam_sessions_exam_id_exams_id_fk FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: exam_sessions exam_sessions_student_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exam_sessions
    ADD CONSTRAINT exam_sessions_student_id_users_id_fk FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: exams exams_created_by_admin_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_created_by_admin_id_users_id_fk FOREIGN KEY (created_by_admin_id) REFERENCES public.users(id);


--
-- Name: product_exams product_exams_exam_id_exams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.product_exams
    ADD CONSTRAINT product_exams_exam_id_exams_id_fk FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: product_exams product_exams_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.product_exams
    ADD CONSTRAINT product_exams_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: user_exam_access user_exam_access_exam_id_exams_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.user_exam_access
    ADD CONSTRAINT user_exam_access_exam_id_exams_id_fk FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE;


--
-- Name: user_exam_access user_exam_access_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.user_exam_access
    ADD CONSTRAINT user_exam_access_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: user_exam_access user_exam_access_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: kampus_sepeti
--

ALTER TABLE ONLY public.user_exam_access
    ADD CONSTRAINT user_exam_access_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

