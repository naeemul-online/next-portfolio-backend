import { Blog, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createBlog = async (payload: Prisma.BlogCreateInput): Promise<Blog> => {
  const result = await prisma.blog.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
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
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  const result = await prisma.blog.findMany({
    skip,
    take: limit,
    where,
    include: {
      author: true,
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

const getPostById = async (id: number) => {
  //   return await prisma.$transaction(async (tx) => {
  //     await tx.blog.update({
  //       where: { id },
  //       data: {
  //         views: {
  //           increment: 1,
  //         },
  //       },
  //     });
  //     return await tx.blog.findUnique({
  //       where: { id },
  //       include: { author: true },
  //     });
  //   });
};

const updatePost = async (id: number, data: Partial<any>) => {
  return prisma.blog.update({ where: { id }, data });
};

const deletePost = async (id: number) => {
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
  //         isFeatured: true,
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
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStat,
};
