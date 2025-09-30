import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import { calculateReadingTime } from "../../helpers/calculateReadingTime";
import { generateSlug } from "../../helpers/generateSlug";

const createBlog = async (
  payload: Prisma.BlogCreateInput,
  id: number
): Promise<Blog> => {
  let { slug, readingTime, author, ...blogData } = payload;

  if (!slug) {
    slug = generateSlug(blogData.title);
  }

  const existingBlog = await prisma.blog.findUnique({ where: { slug } });

  if (existingBlog) {
    throw new Error("A blog post with this slug already exists");
  }

  if (!readingTime) {
    readingTime = calculateReadingTime(blogData.content);
  }

  const result = await prisma.blog.create({
    data: {
      ...blogData,
      slug,
      readingTime,
      authorId: id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  return result;
};

const getAllBlog = async ({
  page = 1,
  limit = 5,
  search,
  featured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
  tags?: string[];
}) => {
  const skip = (page - 1) * limit;

  const where: any = {
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      typeof featured === "boolean" && { featured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  const result = await prisma.blog.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.blog.count({ where });

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getBlogById = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    await tx.blog.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return await tx.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            role: true,
          },
        },
      },
    });
  });
};

const updateBlog = async (id: number, data: Partial<Blog>) => {
  return prisma.blog.update({ where: { id }, data });
};

const deleteBlog = async (id: number) => {
  return prisma.blog.delete({ where: { id } });
};

const getBlogStat = async () => {
  //   return await prisma.$transaction(async (tx) => {
  //     const aggregates = await tx.blog.aggregate({
  //       _count: true,
  //       _sum: { views: true },
  //       _avg: { views: true },
  //       _max: { views: true },
  //       _min: { views: true },
  //     });
  //     const featuredCount = await tx.post.count({
  //       where: {
  //         featured: true,
  //       },
  //     });
  //     const topFeatured = await tx.post.findFirst({
  //       where: { isFeatured: true },
  //       orderBy: { views: "desc" },
  //     });
  //     const lastWeek = new Date();
  //     lastWeek.setDate(lastWeek.getDate() - 7);
  //     const lastWeekPostCount = await tx.post.count({
  //       where: {
  //         createdAt: {
  //           gte: lastWeek,
  //         },
  //       },
  //     });
  //     return {
  //       stats: {
  //         totalPosts: aggregates._count ?? 0,
  //         totalViews: aggregates._sum.views ?? 0,
  //         avgViews: aggregates._avg.views ?? 0,
  //         minViews: aggregates._min.views ?? 0,
  //         maxViews: aggregates._max.views ?? 0,
  //       },
  //       featured: {
  //         count: featuredCount,
  //         topPost: topFeatured,
  //       },
  //       lastWeekPostCount,
  //     };
  //   });
};

export const BlogService = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogStat,
};
