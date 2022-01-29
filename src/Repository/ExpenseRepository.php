<?php

namespace App\Repository;

use App\Entity\Expense;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Expense|null create($expense)
 * @method Expense|null findById($id)
 * @method Expense[]    findAll()
 * @method Expense[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExpenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expense::class);
    }

    // /**
    //  * @return Expense[] Returns an array of Expense objects
    //  */
    public function findById($id): Expense
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.id = :expense_id')
            ->setParameter('expense_id', $id)
            ->getQuery()
            ->getResult()
        ;
    }


    // /**
    //  * @return boolean creates an Expense instance and returns a boolean
    //  */
    public function create($expense): boolean
    {
        $em = $this->getDoctrine()->getManager();
        var_dump($em);

        return $test;
    }

}
