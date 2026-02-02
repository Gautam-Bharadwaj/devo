const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post("/posts", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || title.trim().length < 1) {
            return res.status(400).json({ error: "Title must be at least 1 character" });
        }

        if (!content || content.trim().length < 5) {
            return res.status(400).json({ error: "Content must be at least 5 characters" });
        }

        const post = await prisma.post.create({
            data: { title, content }
        });

        return res.status(201).json({ message: "Post created successfully", data: post });

    } catch (error) {
        console.error("Create Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/posts", async (req, res) => {
    try {
        let { published, skip = 0, take = 10, fromDate, toDate, sortBy = "createdAt", order = "desc" } = req.query;

        skip = Number(skip || 0);
        take = Math.min(Number(take) || 10, 100);

        const where = {};

        if (published === "true" || published === "false") {
            where.published = published === "true";
        }

        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) where.createdAt.gte = new Date(fromDate);
            if (toDate) where.createdAt.lte = new Date(toDate);
        }

        const posts = await prisma.post.findMany({
            skip: skip,
            take: take,
            orderBy: {
                [sortBy]: order
            }
        });

        const total = await prisma.post.count({ where });

        return res.json({ data: posts, total, skip, take });

    } catch (error) {
        console.error("Read All Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.json({ data: post });

    } catch (error) {
        console.error("Read Single Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, published } = req.body;

        const existingPost = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!existingPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        const updateData = {};
        if (title !== undefined) {
            if (!title || title.trim().length < 1) {
                return res.status(400).json({ error: "Title must be at least 1 character" });
            }
            updateData.title = title;
        }
        if (content !== undefined) {
            if (!content || content.trim().length < 5) {
                return res.status(400).json({ error: "Content must be at least 5 characters" });
            }
            updateData.content = content;
        }
        if (published !== undefined) {
            updateData.published = published;
        }

        const post = await prisma.post.update({
            where: { id: Number(id) },
            data: updateData
        });

        return res.json({ message: "Post updated successfully", data: post });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const existingPost = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!existingPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        const post = await prisma.post.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });

        return res.json({ message: "Post deleted successfully", data: post });

    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = app;

